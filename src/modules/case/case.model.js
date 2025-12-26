import pool from '../../common/config/db.js';
import RazorpayService from '../razorpay/razorpay.service.js';
import SystemLogService from '../systemLog/systemLog.service.js';
import SYSTEM_ACTIONS from '../constants/systemActions.js';

const CaseModel = {

    createCase: async (userId, datas) => {
        const client = await pool.connect();

        const {
            title,
            description,
            claim_amount,
            type
        } = datas;

        if (!title || !type) {
            throw new Error('Title and case type are required');
        }

        await client.query('BEGIN');

        const year = new Date().getFullYear();
        const prefix = type === 'Arbitration' ? 'ARB' : 'MED';

        const countRes = await client.query(
            `
            SELECT COUNT(*) 
            FROM cases 
            WHERE type = $1 
            AND EXTRACT(YEAR FROM created_at) = $2
            `,
            [type, year]
        );

        const serial = String(Number(countRes.rows[0].count) + 1).padStart(4, '0');
        const caseNumber = `${prefix}-${year}-${serial}`;

        const caseRes = await client.query(
            `
            INSERT INTO cases
            (case_number, title, description, claim_amount, type, status, created_by)
            VALUES ($1, $2, $3, $4, $5, 'Filed', $6)
            RETURNING *;
            `,
            [
                caseNumber,
                title,
                description,
                claim_amount,
                type,
                userId
            ]
        );

        const newCase = caseRes.rows[0];

        await SystemLogService.addLog({
            userId: userId,
            entityType: 'case',
            entityId: newCase.id,
            actionType: SYSTEM_ACTIONS.CASE_CREATED,
            notes: `Case ${caseNumber} created successfully`
        });

        await client.query('COMMIT');

        return newCase;

    },

    /* ---------------- ADD PARTY ---------------- */
    addParty: async (caseId, userId, data) => {
        const { name, email, role } = data;

        const { rows } = await pool.query(
            `
      INSERT INTO case_paties
      (case_id, name, email, role, added_by)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
      `,
            [caseId, name, email, role, userId]
        );

        await SystemLogService.addLog({
            userId: userId,
            entityType: 'case',
            entityId: caseId,
            actionType: SYSTEM_ACTIONS.PARTY_ADDED,
            notes: `Party Added`
        });

        return rows[0];
    },

    /* ---------------- ADD DOCUMENT ---------------- */
    addDocument: async (caseId, userId, data) => {
        const { doc_type, file_url } = data;

        const { rows } = await pool.query(
            `
            INSERT INTO case_documents
            (case_id, doc_type, file_url, uploaded_by)
            VALUES ($1,$2,$3,$4)
            RETURNING *;
            `,
            [caseId, doc_type, file_url, userId]
        );

        await SystemLogService.addLog({
            userId: userId,
            entityType: 'case',
            entityId: caseId,
            actionType: SYSTEM_ACTIONS.CASE_DOCUMENTED_ADDED,
            notes: `Case Document Added`
        });

        return rows[0];
    },

    /* ---------------- PAYMENT + FILE CASE ---------------- */
    verifyCasePayment: async (caseId, data) => {
        const client = await pool.connect();

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = data;

        await client.query('BEGIN');

        const isValid = RazorpayService.verifySignature({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature
        });

        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Invalid payment' });
        }

        await pool.query(
            `INSERT INTO case_payments (case_id, payment_id, amount, method)
              VALUES ($1, $2, $3, $4)`,
            [caseId, razorpay_payment_id, 5000, 'Razorpay']
        );

        await pool.query(
            `UPDATE cases SET status='Filed' WHERE id=$1`,
            [caseId]
        );

        await SystemLogService.addLog({
            userId: userId,
            entityType: 'case',
            entityId: caseId,
            actionType: SYSTEM_ACTIONS.CASE_FILED,
            notes: `Filing fee paid`
        });

        await client.query('COMMIT');
        return true;
    },

    arbitratorsShortlist: async ({ caseId, arbitratorIds, selectedBy }) => {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            for (const arbitratorId of arbitratorIds) {
                await client.query(
                    `
                INSERT INTO case_arbitrators
                (case_id, arbitrator_id, selected_by, status)
                VALUES ($1, $2, $3, 'pending')
                ON CONFLICT (case_id, arbitrator_id) DO NOTHING
                `,
                    [caseId, arbitratorId, selectedBy]
                );
            }

            // Move case to arbitrator selection phase
            await client.query(
                `
            UPDATE cases
            SET status = 'arbitrator_selection'
            WHERE id = $1
            `,
                [caseId]
            );

            await client.query('COMMIT');

            await SystemLogService.addLog({
                userId: req.user.id,
                entityType: 'case',
                entityId: caseId,
                actionType: SYSTEM_ACTIONS.ARBITRATOR_SHORTLISTED,
                notes: `Arbitrators shortlisted: ${arbitratorIds.join(', ')}`
            });

            return true;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    updateArbitratorStatus: async ({ caseId, arbitratorId, status }) => {
        await pool.query(
            `
            UPDATE case_arbitrators
            SET status = $1, responded_at = NOW()
            WHERE case_id = $2 AND arbitrator_id = $3
            `,
            [status, caseId, arbitratorId]
        );
    },
    getCaseArbitrators: async (caseId, status) => {
        let query = `
                SELECT
                ca.arbitrator_id,
                ca.status,
                a.full_name,
                a.city,
                a.specialization,
                a.experience_years,
                a.fees
                FROM case_arbitrators ca
                JOIN arbitrators a ON a.id = ca.arbitrator_id
                WHERE ca.case_id = $1
            `;

        const params = [caseId];

        if (status) {
            query += ` AND ca.status = $2`;
            params.push(status);
        }

        const { rows } = await pool.query(query, params);
        return rows;
    },
    respondentDecision: async ({ caseId, action, userId, reason }) => {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            await client.query(
                `
      UPDATE cases
      SET respondent_approved = $1,
          respondent_decided_at = NOW()
      WHERE id = $2
      `,
                [action === 'approved', caseId]
            );

            if (action === 'rejected') {
                await client.query(
                    `
        DELETE FROM case_arbitrators
        WHERE case_id = $1
        `,
                    [caseId]
                );

                await client.query(
                    `
        UPDATE cases
        SET status = 'arbitrator_selection'
        WHERE id = $1
        `,
                    [caseId]
                );
            }

            await SystemLogService.addLog({
                userId,
                entityType: 'case',
                entityId: caseId,
                actionType: 'RESPONDENT_ARBITRATOR_DECISION',
                notes: `Respondent ${action} arbitrator shortlist. ${reason || ''}`
            });

            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },
    arbitratorDecision: async ({ caseId, arbitratorId, action, userId }) => {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const { rows } = await client.query(
                `
      SELECT respondent_approved
      FROM cases
      WHERE id = $1
      `,
                [caseId]
            );

            if (!rows[0]?.respondent_approved) {
                throw new Error('Respondent approval pending');
            }

            if (action === 'accepted') {
                const { rowCount } = await client.query(
                    `
        UPDATE case_arbitrators
        SET status = 'accepted', responded_at = NOW()
        WHERE case_id = $1 AND arbitrator_id = $2 AND status = 'pending'
        `,
                    [caseId, arbitratorId]
                );

                if (!rowCount) {
                    throw new Error('Arbitrator already responded or not eligible');
                }

                await client.query(
                    `
        UPDATE case_arbitrators
        SET status = 'rejected'
        WHERE case_id = $1 AND arbitrator_id != $2
        `,
                    [caseId, arbitratorId]
                );

                await client.query(
                    `
        UPDATE cases
        SET arbitrator_id = $2,
            status = 'proceedings'
        WHERE id = $1
        `,
                    [caseId, arbitratorId]
                );
            }

            if (action === 'rejected') {
                await client.query(
                    `
        UPDATE case_arbitrators
        SET status = 'rejected', responded_at = NOW()
        WHERE case_id = $1 AND arbitrator_id = $2
        `,
                    [caseId, arbitratorId]
                );
            }

            await SystemLogService.addLog({
                userId,
                entityType: 'case',
                entityId: caseId,
                actionType: 'ARBITRATOR_RESPONSE',
                notes: `Arbitrator ${action} the case`
            });

            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }





};

export default CaseModel;

import pool from '../../common/config/db.js';

const CaseModel = {

    createCase: async (userId, datas) => {
        const client = await pool.connect();

        try {
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

            const caseRes = await client.query(
                `
        INSERT INTO cases
        (title, description, claim_amount, type, status, created_by)
        VALUES ($1, $2, $3, $4, 'Filed', $5)
        RETURNING *;
        `,
                [title, description, claim_amount, type, userId]
            );

            const newCase = caseRes.rows[0];

            await client.query(
                `
        INSERT INTO system_logs
        (user_id, entity_type, entity_id, action_type, notes)
        VALUES ($1, 'case', $2, 'CASE_FILED', $3);
        `,
                [
                    userId,
                    newCase.id,
                    'Case filed successfully'
                ]
            );

            await client.query('COMMIT');

            return newCase;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
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

        return rows[0];
    },

    /* ---------------- PAYMENT + FILE CASE ---------------- */
    addPayment: async (caseId, userId, data) => {
        const client = await pool.connect();

        try {
            const { payment_id, amount, gst_invoice, method } = data;

            await client.query('BEGIN');

            await client.query(
                `
        INSERT INTO case_payments
        (case_id, payment_id, amount, gst_invoice, method)
        VALUES ($1,$2,$3,$4,$5);
        `,
                [caseId, payment_id, amount, gst_invoice, method]
            );

            await client.query(
                `
        UPDATE cases
        SET status = 'Filed', updated_at = NOW()
        WHERE id = $1;
        `,
                [caseId]
            );

            await client.query(
                `
        INSERT INTO system_logs
        (user_id, entity_type, entity_id, action_type, notes)
        VALUES ($1,'case',$2,'CASE_FILED','Filing fee paid');
        `,
                [userId, caseId]
            );

            await client.query('COMMIT');
            return true;

        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

};

export default CaseModel;

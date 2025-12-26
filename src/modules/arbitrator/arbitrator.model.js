import pool from '../../common/config/db.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

/* Generate 6-digit numeric code */
const generateCode = () => crypto.randomInt(100000, 999999).toString();


const ArbitratorModel = {

    registerArbitrator: async (datas) => {
        const client = await pool.connect();

        try {
            const { name, email, role_type } = datas;

            if (!role_type) throw new Error('role_type is required');

            await client.query('BEGIN');


            const roleRes = await client.query(
                'SELECT id FROM roles WHERE name = $1',
                [role_type]
            );

            if (!roleRes.rows.length) {
                throw new Error('Invalid role_type');
            }

            const roleId = roleRes.rows[0].id;

            const userRes = await client.query(
                'SELECT id, is_verified FROM users WHERE email = $1',
                [email]
            );

            let userId;

            if (userRes.rows.length) {
                userId = userRes.rows[0].id;


                if (userRes.rows[0].is_verified) {
                    throw new Error('User already verified');
                }
            } else {

                const insertUser = await client.query(
                    `INSERT INTO users (name, email, role_id)
                 VALUES ($1, $2, $3)
                 RETURNING id`,
                    [name, email, roleId]
                );

                userId = insertUser.rows[0].id;
            }


            const code = generateCode();
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

            await client.query(
                `UPDATE users
             SET verification_code = $1,
                 verification_expires_at = $2,
                 updated_at = NOW()
             WHERE id = $3`,
                [code, expiresAt, userId]
            );


            await client.query(
                `INSERT INTO system_logs
             (user_id, entity_type, entity_id, action_type, notes)
             VALUES ($1, 'ARBITRATOR', $1, 'REGISTRATION_INITIATED', $2)`,
                [
                    userId,
                    `Verification code generated for role ${role_type.toUpperCase()}`
                ]
            );

            await client.query('COMMIT');

            return {
                userId,
                verification_code: code,
                expiresAt
            };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    verifyEmailAndSetPassword: async (datas) => {
        const client = await pool.connect();


        const { email, code, password } = datas;

        if (!email || !code || !password) {
            throw new Error('Email, verification code, and password are required');
        }

        await client.query('BEGIN');


        const { rows } = await client.query(
            `SELECT * FROM users WHERE email = $1 AND verification_code = $2`,
            [email, code]
        );

        if (!rows.length) {
            throw new Error('Invalid verification code');
        }

        const user = rows[0];


        if (!user.verification_expires_at || new Date(user.verification_expires_at) < new Date()) {
            throw new Error('Verification code expired');
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        await client.query(
            `
      UPDATE users
      SET password = $1,
          is_verified = true,
          verification_code = NULL,
          verification_expires_at = NULL,
          updated_at = NOW()
      WHERE id = $2
      `,
            [hashedPassword, user.id]
        );


        await client.query(
            `INSERT INTO system_logs
             (user_id, entity_type, entity_id, action_type, notes)
             VALUES ($1, 'ARBITRATOR', $1, 'EMAIL_VERIFIED', $2)`,
            [
                user.id,
                `Verification code  verified.`
            ]
        );

        await client.query('COMMIT');

        return { message: 'Email verified and password set successfully' }

    },
    submitArbitratorProfile: async (userId, datas) => {
        const client = await pool.connect();


        const {
            full_name,
            email,
            phone,
            languages,
            city,
            experience_years,
            specialization,
            bio,
            fees,
            bank,
            documents
        } = datas;


        await client.query('BEGIN');
        const existing = await client.query(
            `SELECT id FROM arbitrators WHERE user_id = $1`,
            [userId]
        );

        if (existing.rows.length) {
            throw new Error('Arbitrator profile already exists');
        }

        console.log(userId);
        const arbRes = await client.query(
            `
      INSERT INTO arbitrators (
        user_id, full_name, email, phone,
        languages, city, experience_years,
        specialization, bio, fees, status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending')
      RETURNING *;
      `,
            [
                userId,
                full_name,
                email,
                phone,
                languages,
                city,
                experience_years,
                specialization,
                bio,
                fees
            ]
        );

        if (bank) {
            await client.query(
                `
                        INSERT INTO arbitrator_bank_details
                        (user_id, account_name, account_number, ifsc, bank_name, gst_number)
                        VALUES ($1,$2,$3,$4,$5,$6)
                        ON CONFLICT (user_id)
                        DO UPDATE SET
                        account_name = EXCLUDED.account_name,
                        account_number = EXCLUDED.account_number,
                        ifsc = EXCLUDED.ifsc,
                        bank_name = EXCLUDED.bank_name,
                        gst_number = EXCLUDED.gst_number,
                        updated_at = NOW();
                        `,
                [
                    userId,
                    bank.account_name,
                    bank.account_number,
                    bank.ifsc,
                    bank.bank_name,
                    bank.gst_number
                ]
            );
        }

        if (Array.isArray(documents) && documents.length) {
            for (const doc of documents) {
                await client.query(
                    `
          INSERT INTO arbitrator_documents
          (user_id, doc_type, file_url)
          VALUES ($1,$2,$3);
          `,
                    [userId, doc.doc_type, doc.file_url]
                );
            }
        }

        await client.query(
            `
            UPDATE users
            SET is_onboarding = true, updated_at = NOW()
            WHERE id = $1;
            `,
            [userId]
        );



        await client.query(
            `INSERT INTO system_logs
             (user_id, entity_type, entity_id, action_type, notes)
             VALUES ($1, 'ARBITRATOR_ONBOARDING', $1, 'EMAIL_VERIFIED', $2)`,
            [
                userId,
                `Profile, bank & KYC submitted`
            ]
        );

        await client.query('COMMIT');

        return arbRes.rows[0]

    },

    /* ---------------- FIND BY USER ---------------- */
    findByUserId: async (userId) => {
        const { rows } = await pool.query(
            `SELECT * FROM arbitrators WHERE user_id = $1`,
            [userId]
        );
        return rows[0];
    },

    /* ---------------- PENDING (ADMIN) ---------------- */
    findPending: async () => {
        const { rows } = await pool.query(
            `SELECT * FROM arbitrators WHERE status = 'pending' ORDER BY created_at DESC`
        );
        return rows;
    },

    /* ---------------- APPROVE (ADMIN) ---------------- */
    approve: async (userId, adminId) => {
        const { rows } = await pool.query(
            `
      UPDATE arbitrators
      SET status = 'verified',
          approved_by = $1,
          approved_at = NOW(),
          verified_at = NOW(),
          updated_at = NOW()
      WHERE user_id = $2
      RETURNING *;
      `,
            [adminId, userId]
        );

        return rows[0];
    },

    /* ---------------- REJECT (ADMIN) ---------------- */
    reject: async (id, reason) => {
        const { rows } = await pool.query(
            `
      UPDATE arbitrators
      SET status = 'rejected',
          rejection_reason = $1,
          updated_at = NOW()
      WHERE user_id = $2
      RETURNING *;
      `,
            [reason, id]
        );

        return rows[0];
    },

    /* ---------------- APPROVED / SELECTABLE ---------------- */
    findApprovedWithFilters: async (filters) => {
        const {
            city,
            specialization,
            minFees,
            maxFees,
            minExperience
        } = filters;

        let query = `
        SELECT
            id,
            full_name,
            city,
            specialization,
            experience_years,
            fees
        FROM arbitrators
        WHERE status = 'verified'
    `;

        const values = [];
        let idx = 1;

        if (city) {
            query += ` AND city = $${idx++}`;
            values.push(city);
        }

        if (specialization) {
            query += ` AND $${idx++} = ANY (specialization)`;
            values.push(specialization);
        }

        if (minFees) {
            query += ` AND fees >= $${idx++}`;
            values.push(minFees);
        }

        if (maxFees) {
            query += ` AND fees <= $${idx++}`;
            values.push(maxFees);
        }

        if (minExperience) {
            query += ` AND experience_years >= $${idx++}`;
            values.push(minExperience);
        }

        query += ` ORDER BY experience_years DESC`;

        const { rows } = await pool.query(query, values);
        return rows;
    },

    /* ---------------- UPDATE PROFILE ---------------- */
    updateProfileWithLog: async (userId, datas) => {
        const client = await pool.connect();

        const {
            updatedBy,
            role = 'USER',
            data,
            note = null
        } = datas;


        if (!userId) throw new Error('Arbitrator ID is required');

        await client.query('BEGIN');

        // Blocked fields
        const blockedFields = [
            'id',
            'user_id',
            'created_at',
            'submitted_at',
            'verified_at',
            'approved_at',
            'approved_by'
        ];

        const fields = [];
        const values = [];
        let index = 1;

        for (const key in data) {
            if (blockedFields.includes(key)) continue;
            if (data[key] === undefined) continue;

            fields.push(`${key} = $${index}`);
            values.push(data[key]);
            index++;
        }

        if (!fields.length) {
            throw new Error('No valid fields provided for update');
        }

        values.push(userId);

        const updateQuery = `
            UPDATE arbitrators
            SET ${fields.join(', ')},
                updated_at = NOW()
            WHERE id = $${index}
            RETURNING *;
        `;

        const { rows } = await client.query(updateQuery, values);

        if (!rows.length) throw new Error('Arbitrator not found');

        const arbitrator = rows[0];

        /* -------------------- LOG ENTRY -------------------- */
        const action =
            role === 'ADMIN'
                ? 'ADMIN_UPDATED_PROFILE'
                : 'USER_UPDATED_PROFILE';

        await client.query(
            `
            INSERT INTO arbitrator_admin_logs
            (user_id, admin_id, action, notes)
            VALUES ($1, $2, $3, $4);
            `,
            [
                arbitrator.user_id,
                role === 'ADMIN' ? updatedBy : null,
                action,
                note || `Updated fields: ${Object.keys(data).join(', ')}`
            ]
        );

        await client.query('COMMIT');
        return arbitrator;

    }
};

export default ArbitratorModel;

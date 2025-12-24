import pool from '../../common/config/db.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

/* Generate 6-digit numeric code */
const generateCode = () => crypto.randomInt(100000, 999999).toString();


const ArbitratorModel = {

    registerArbitrator: async (datas) => {
        const client = await pool.connect();


        const { name, email, role_type } = datas

        if (!role_type) throw new Error('role_type is required');

        await client.query('BEGIN');

        const roleRes = await client.query(
            'SELECT id FROM roles WHERE role_type = $1',
            [role_type]
        );

        if (!roleRes.rows.length) throw new Error('Invalid role_type');

        const roleId = roleRes.rows[0].id;

        let { rows } = await client.query(
            'SELECT id, email_verified FROM users WHERE email = $1',
            [email]
        );

        let userId;
        if (rows.length) {
            userId = rows[0].id;

            if (rows[0].email_verified) {
                throw new Error('User already verified');
            }
        } else {
            const insertUser = await client.query(
                `INSERT INTO users 
                        (name, email, role_id)
                        VALUES ($1,$2,$3)
                        RETURNING id,email`,
                [name, email, roleId]
            );
            userId = insertUser.rows[0].id;
        }

        const code = generateCode();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

        await client.query(
            `
                UPDATE users
                SET verification_code = $1,
                    verification_expires_at = $2,
                    updated_at = NOW()
                WHERE id = $3
            `,
            [code, expiresAt, userId]
        );

        await client.query(
            `
                INSERT INTO arbitrator_admin_logs
                (user_id, action, notes)
                VALUES ($1,'REGISTRATION_INITIATED','Verification code generated for role ${role_type.toUpperCase()}')
                `,
            [userId]
        );

        await client.query('COMMIT');

        return {
            userId,
            verification_code: code,
            expiresAt
        };
    },

    verifyEmailAndSetPassword: async (datas) => {
        const client = await pool.connect();


        const { email, code, password } = datas;

        if (!email || !code || !password) {
            throw new Error('Email, verification code, and password are required');
        }

        await client.query('BEGIN');

        // 1️⃣ Get user with matching verification code
        const { rows } = await client.query(
            `SELECT * FROM users WHERE email = $1 AND verification_code = $2`,
            [email, code]
        );

        if (!rows.length) {
            throw new Error('Invalid verification code');
        }

        const user = rows[0];

        // 2️⃣ Check if verification code is expired
        if (!user.verification_expires_at || new Date(user.verification_expires_at) < new Date()) {
            throw new Error('Verification code expired');
        }

        // 3️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4️⃣ Update user record
        await client.query(
            `
      UPDATE users
      SET password = $1,
          email_verified = true,
          verification_code = NULL,
          verification_expires_at = NULL,
          updated_at = NOW()
      WHERE id = $2
      `,
            [hashedPassword, user.id]
        );

        // 5️⃣ Log action
        await client.query(
            `
      INSERT INTO arbitrator_admin_logs
      (user_id, action, notes)
      VALUES ($1,'EMAIL_VERIFIED','User verified email and set password')
      `,
            [user.id]
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
            `
      INSERT INTO arbitrator_admin_logs
      (user_id, action, notes)
      VALUES ($1,'SUBMITTED','Profile, bank & KYC submitted');
      `,
            [userId]
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
    approve: async (id, adminId) => {
        const { rows } = await pool.query(
            `
      UPDATE arbitrators
      SET status = 'verified',
          approved_by = $1,
          approved_at = NOW(),
          verified_at = NOW(),
          updated_at = NOW()
      WHERE id = $2
      RETURNING *;
      `,
            [adminId, id]
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
      WHERE id = $2
      RETURNING *;
      `,
            [reason, id]
        );

        return rows[0];
    },

    /* ---------------- APPROVED / SELECTABLE ---------------- */
    findApproved: async () => {
        const { rows } = await pool.query(
            `
      SELECT
        id,
        full_name,
        city,
        specialization,
        experience_years,
        fees
      FROM arbitrators
      WHERE status = 'verified'
      ORDER BY experience_years DESC;
      `
        );
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

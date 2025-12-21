import bcrypt from 'bcrypt';
import pool from '../common/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const seedSuperAdmin = async () => {
    const client = await pool.connect();

    try {
        // Check if super admin already exists
        const checkQuery = `
            SELECT id FROM users WHERE is_super_admin = true LIMIT 1
        `;
        const { rows } = await client.query(checkQuery);

        if (rows.length > 0) {
            console.log('Super Admin already exists');
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            process.env.SUPER_ADMIN_PASSWORD || 'Admin@123',
            10
        );

        // Insert super admin
        const insertQuery = `
            INSERT INTO users (
                name,
                email,
                password,
                is_verified,
                is_super_admin,
                role_id
            )
            VALUES ($1, $2, $3, true, true, 1)
        `;

        await client.query(insertQuery, [
            'Super Admin',
            process.env.SUPER_ADMIN_EMAIL || 'superadmin@arbitrary.com',
            hashedPassword
        ]);

        console.log('Super Admin seeded successfully');
    } catch (err) {
        console.error('Super Admin seeding failed:', err);
    } finally {
        client.release();
    }
};

export default seedSuperAdmin;

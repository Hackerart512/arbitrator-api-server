import pool from '../../common/config/db.js';

const createArbitratorAdminLogTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS arbitrator_admin_logs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            user_id UUID UNIQUE NOT NULL
            REFERENCES users(id) ON DELETE CASCADE,
            admin_id UUID UNIQUE NOT NULL
            REFERENCES users(id) ON DELETE CASCADE,
            action VARCHAR(50),
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
   `;

    await pool.query(query);

    console.log('Arbitrator documents table ready');
};

export default createArbitratorAdminLogTable;

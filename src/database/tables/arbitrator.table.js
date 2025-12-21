import pool from '../../common/config/db.js';

const createArbitratorTable = async () => {
    const query = `
     CREATE TABLE IF NOT EXISTS arbitrators (
        id SERIAL PRIMARY KEY,

        user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,

        full_name TEXT NOT NULL,
        phone TEXT,
        qualification TEXT,
        experience_years INT,

        kyc_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING | APPROVED | REJECTED
        kyc_remarks TEXT,

        approved_by UUID REFERENCES users(id),
        approved_at TIMESTAMP,

        is_active BOOLEAN DEFAULT false,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

    await pool.query(query);
    console.log('Arbitrator table ready');
};

export default createArbitratorTable;

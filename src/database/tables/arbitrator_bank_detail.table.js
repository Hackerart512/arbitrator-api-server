import pool from '../../common/config/db.js';

const createArbitratorBankDetailTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS arbitrator_bank_details (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
             user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            account_name VARCHAR(150),
            account_number VARCHAR(50),
            ifsc VARCHAR(20),
            bank_name VARCHAR(100),
            gst_number VARCHAR(20),

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
   `;

    await pool.query(query);

    console.log('Arbitrator documents table ready');
};

export default createArbitratorBankDetailTable;

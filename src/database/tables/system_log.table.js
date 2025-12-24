import pool from '../../common/config/db.js';

const createSystemLogTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS system_logs  (
           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id),
            entity_type VARCHAR(50),      -- 'case', 'party', 'document', 'payment'
            entity_id UUID,               -- target entity
            action_type VARCHAR(50),      -- e.g., 'CASE_CREATED', 'PAYMENT_COMPLETED'
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
   `;

    await pool.query(query);

    console.log('createSystemLogTable  table ready');
};

export default createSystemLogTable;

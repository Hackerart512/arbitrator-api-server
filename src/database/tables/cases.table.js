import pool from '../../common/config/db.js';

const createCaseTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS cases (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            case_number VARCHAR(30) UNIQUE NOT NULL, 
            -- Example: ARB-2025-0001
            title VARCHAR(255) NOT NULL,
            description TEXT,
            claim_amount NUMERIC(15,2),
            type VARCHAR(50) CHECK (type IN ('Arbitration','Mediation')),
            status VARCHAR(50) DEFAULT 'Draft',  -- Draft, Selection Phase, Evidence, Closed, etc.
            
            selection_deadline TIMESTAMP,
            evidence_submission_start TIMESTAMP,
            evidence_submission_end TIMESTAMP,
            reply_deadline TIMESTAMP,

            created_by UUID REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
   `;

    await pool.query(query);

    console.log('Case table ready');
};

export default createCaseTable;

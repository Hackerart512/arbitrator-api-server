import pool from '../../common/config/db.js';

const createCasePartyTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS case_paties (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
            name VARCHAR(150) NOT NULL,
            email VARCHAR(150),
            role VARCHAR(50) CHECK (role IN ('claimant','respondent','legal_counsel')),
            added_by UUID REFERENCES users(id),
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
   `;

    await pool.query(query);

    console.log('createCasePartyTable  table ready');
};

export default createCasePartyTable;

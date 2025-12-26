import pool from '../../common/config/db.js';

const createCaseArbitratorsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS case_arbitrators (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            case_id UUID NOT NULL
                REFERENCES cases(id) ON DELETE CASCADE,

            arbitrator_id UUID NOT NULL
                REFERENCES arbitrators(id) ON DELETE CASCADE,

            selected_by UUID NOT NULL
                REFERENCES users(id),

            selection_round INT DEFAULT 1,

            status VARCHAR(30) DEFAULT 'pending',
            CHECK (status IN (
                'pending',       -- waiting for respondent/arbitrator
                'accepted',      -- arbitrator accepted
                'rejected',      -- rejected by respondent/arbitrator
                'countered'      -- counter shortlist
            )),

            responded_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            UNIQUE (case_id, arbitrator_id)
        );
    `;

    await pool.query(query);
    console.log('case_arbitrators table ready');
};

export default createCaseArbitratorsTable;

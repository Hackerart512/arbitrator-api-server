import pool from '../../common/config/db.js';

const createCaseDocumentsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS case_documents (
             id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
            doc_type VARCHAR(100),
            file_url TEXT,
            uploaded_by UUID REFERENCES users(id),
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
   `;

    await pool.query(query);

    console.log('createCaseDocumentsTable  table ready');
};

export default createCaseDocumentsTable;

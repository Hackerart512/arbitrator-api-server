import pool from '../../common/config/db.js';

const createArbitratorDocumentTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS arbitrator_documents (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

             user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      
            doc_type VARCHAR(50),
            file_url TEXT,
            verified BOOLEAN DEFAULT false,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
   `;

    await pool.query(query);

    console.log('Arbitrator documents table ready');
};

export default createArbitratorDocumentTable;

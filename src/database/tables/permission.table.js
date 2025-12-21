import pool from '../../common/config/db.js';

const createPermissionTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS permissions  (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NULL,
            key VARCHAR(100) UNIQUE NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await pool.query(query);
    console.log('permission table ready');
};

export default createPermissionTable;
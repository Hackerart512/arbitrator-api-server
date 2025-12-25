import pool from '../../common/config/db.js';

const createUserTable = async () => {
  const query = `
     CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    is_verified BOOLEAN DEFAULT false,
    role_id INT REFERENCES roles(id),
    is_super_admin BOOLEAN DEFAULT false,
    verification_code VARCHAR(10),
    verification_expires_at TIMESTAMP,
    is_onboarding BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await pool.query(query);
  console.log('users table ready');
};

export default createUserTable;

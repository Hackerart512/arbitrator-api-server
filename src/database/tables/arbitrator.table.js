import pool from '../../common/config/db.js';

const createArbitratorTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS arbitrators (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      user_id UUID UNIQUE NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

      -- Profile
      full_name VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      phone VARCHAR(20),
      languages TEXT[],
       city VARCHAR(100),
      experience_years INT,
      specialization TEXT[],
      bio TEXT,
      fees NUMERIC(10,2),
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      verified_at TIMESTAMP,
      rejection_reason TEXT,
      status VARCHAR(20) DEFAULT 'pending',
      CHECK (status IN ('pending', 'suspended', 'rejected','verified')),
      approved_by UUID REFERENCES users(id),
      approved_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await pool.query(query);

  console.log('Arbitrator table ready');
};

export default createArbitratorTable;

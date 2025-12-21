import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import pool from './common/config/db.js';
import bootstrapDatabase from './database/index.js';

/* ------------------
  DB Connection Check
------------------- */
const connectDB = async () => {
  const client = await pool.connect();
  client.release();
  console.log('PostgreSQL connected');
};
await connectDB();


/* ------------------
  Create tables if not exist
------------------- */
await bootstrapDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Docs at http://localhost:${PORT}/api-docs`);
});

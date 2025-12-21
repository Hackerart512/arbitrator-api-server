import db from '../../common/config/db.js';
import bcrypt from 'bcrypt';

/* --------------------------
  USER CRUD
----------------------------*/

// Create user (password hashed)
export const createUser = async ({ name, email, password, role_id }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
        'INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role_id, created_at',
        [name, email, hashedPassword, role_id]
    );
    return rows[0];
};

// Get all users
export const getUsers = async () => {
    const { rows } = await db.query('SELECT id, name, email, role_id, created_at FROM users WHERE role_id != 1');
    return rows;
};

// Get single user
export const getUserById = async (id) => {
    const { rows } = await db.query(
        'SELECT id, name, email, role_id, created_at FROM users where role_id != 1 WHERE id = $1',
        [id]
    );
    return rows[0];
};

// Get user by email (for login)
export const getUserByEmail = async (email) => {
    const { rows } = await db.query(
        `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.password,
      r.name AS role_name,
      COALESCE(
        ARRAY_AGG(p.key) FILTER (WHERE p.key IS NOT NULL),
        '{}'
        ) AS permissions
    FROM users u
    JOIN roles r ON r.id = u.role_id
    LEFT JOIN role_permissions rp ON rp.role_id = r.id
    LEFT JOIN permissions p ON p.id = rp.permission_id
    WHERE u.email = $1
    GROUP BY u.id, r.name
    `,
        [email]
    );

    return rows[0];
};


// Update user
export const updateUser = async (id, { name, email, password, role_id }) => {
    let query = 'UPDATE users SET name=$1, email=$2, role_id=$3';
    const params = [name, email, role_id];
    if (password) {
        query += ', password=$4 WHERE id=$5 RETURNING id, name, email, role_id, created_at';
        const hashedPassword = await bcrypt.hash(password, 10);
        params.push(hashedPassword, id);
    } else {
        query += ' WHERE id=$4 RETURNING id, name, email, role_id, created_at';
        params.push(id);
    }
    const { rows } = await db.query(query, params);
    return rows[0];
};

// Delete user
export const deleteUser = async (id) => {
    const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [id]);
    return rowCount;
};

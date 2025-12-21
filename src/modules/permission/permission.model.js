import db from '../../common/config/db.js';

/* --------------------------
   PERMISSION CRUD
----------------------------*/

// Get all permissions
export const getAllPermissions = async () => {
  const { rows } = await db.query('SELECT id, name, description FROM permissions ORDER BY id');
  return rows;
};

// Get single permission by ID
export const getPermissionById = async (permissionId) => {
  const { rows } = await db.query('SELECT id, name, description FROM permissions WHERE id = $1', [permissionId]);
  return rows[0];
};

// Create a new permission
export const createPermission = async (name, description) => {
  const { rows } = await db.query(
    'INSERT INTO permissions (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return rows[0];
};

// Update permission
export const updatePermission = async (permissionId, name, description) => {
  const { rows } = await db.query(
    'UPDATE permissions SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, permissionId]
  );
  return rows[0];
};

// Delete permission
export const deletePermission = async (permissionId) => {
  const { rowCount } = await db.query('DELETE FROM permissions WHERE id = $1', [permissionId]);
  return rowCount;
};

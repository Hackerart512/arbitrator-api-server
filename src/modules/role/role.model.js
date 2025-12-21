import db from '../../common/config/db.js';

// Get all roles
export const getAllRoles = async () => {
    const { rows } = await db.query('SELECT id, name, description FROM roles ORDER BY id');
    return rows;
};

// Get single role by ID
export const getRoleById = async (roleId) => {
    const { rows } = await db.query('SELECT id, name, description FROM roles WHERE id = $1', [roleId]);
    return rows[0];
};

// Create a new role
export const createRole = async (name, description) => {
    const { rows } = await db.query(
        'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *',
        [name, description]
    );
    return rows[0];
};

// Update role
export const updateRole = async (roleId, name, description) => {
    const { rows } = await db.query(
        'UPDATE roles SET name = $1, description = $2 WHERE id = $3 RETURNING *',
        [name, description, roleId]
    );
    return rows[0];
};

// Delete role
export const deleteRole = async (roleId) => {
    const { rowCount } = await db.query('DELETE FROM roles WHERE id = $1', [roleId]);
    return rowCount;
};

/* --------------------------
   ROLE PERMISSIONS
----------------------------*/

export const getRolePermissions = async (roleId) => {
    const { rows } = await db.query(
        `SELECT p.name
     FROM permissions p
     JOIN role_permissions rp ON p.id = rp.permission_id
     WHERE rp.role_id = $1`,
        [roleId]
    );
    return rows.map(r => r.name);
};

// Assign permissions to a role
export const assignPermissions = async (roleId, permissionNames) => {
    const { rows: permRows } = await db.query(
        'SELECT id, name, key FROM permissions WHERE key = ANY($1)',
        [permissionNames]
    );

    if (permRows.length === 0) return 0;

    const queries = permRows.map(p =>
        db.query(
            'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [roleId, p.id]
        )
    );

    await Promise.all(queries);
    return permRows.length;
};

// Remove permissions from a role
export const removePermissions = async (roleId, permissionNames) => {
    const { rows: permRows } = await db.query(
        'SELECT id, name, key FROM permissions WHERE key = ANY($1)',
        [permissionNames]
    );

    if (permRows.length === 0) return 0;

    const queries = permRows.map(p =>
        db.query('DELETE FROM role_permissions WHERE role_id = $1 AND permission_id = $2', [roleId, p.id])
    );

    await Promise.all(queries);
    return permRows.length;
};

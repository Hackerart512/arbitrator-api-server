import * as RoleModel from './role.model.js';

/* --------------------------
   ROLE CRUD
----------------------------*/

// Get all roles
export const getAllRoles = async (req, res, next) => {
    try {
        const roles = await RoleModel.getAllRoles();
        res.json({ success: true, data: roles });
    } catch (err) {
        next(err);
    }
};

// Get single role by ID
export const getRoleById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const role = await RoleModel.getRoleById(id);

        if (!role) return res.status(404).json({ message: 'Role not found' });

        res.json({ success: true, data: role });
    } catch (err) {
        next(err);
    }
};

// Create a new role
export const createRole = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const role = await RoleModel.createRole(name, description);
        res.status(201).json({ success: true, data: role });
    } catch (err) {
        next(err);
    }
};

// Update role
export const updateRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const role = await RoleModel.updateRole(id, name, description);

        if (!role) return res.status(404).json({ message: 'Role not found' });

        res.json({ success: true, data: role });
    } catch (err) {
        next(err);
    }
};

// Delete role
export const deleteRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rowCount = await RoleModel.deleteRole(id);

        if (rowCount === 0) return res.status(404).json({ message: 'Role not found' });

        res.json({ success: true, message: 'Role deleted successfully' });
    } catch (err) {
        next(err);
    }
};

/* --------------------------
   ROLE PERMISSIONS
----------------------------*/

// Get permissions assigned to a role
export const getRolePermissions = async (req, res, next) => {
    try {
        const { id } = req.params;
        const permissions = await RoleModel.getRolePermissions(id);
        res.json({ success: true, data: permissions });
    } catch (err) {
        next(err);
    }
};

// Assign permissions to a role
export const assignPermissions = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { permissions } = req.body; // array of permission names

        if (!Array.isArray(permissions) || permissions.length === 0) {
            return res.status(400).json({ message: 'permissions array is required' });
        }

        const count = await RoleModel.assignPermissions(id, permissions);
        res.json({ success: true, message: `${count} permissions assigned successfully` });
    } catch (err) {
        next(err);
    }
};

// Remove permissions from a role
export const removePermissions = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { permissions } = req.body; // array of permission names

        if (!Array.isArray(permissions) || permissions.length === 0) {
            return res.status(400).json({ message: 'permissions array is required' });
        }

        const count = await RoleModel.removePermissions(id, permissions);
        res.json({ success: true, message: `${count} permissions removed successfully` });
    } catch (err) {
        next(err);
    }
};

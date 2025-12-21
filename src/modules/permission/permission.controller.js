import * as PermissionModel from './permission.model.js';

/* --------------------------
   PERMISSION CONTROLLER
----------------------------*/

// Get all permissions
export const getAllPermissions = async (req, res, next) => {
  try {
    const permissions = await PermissionModel.getAllPermissions();
    res.json({ success: true, data: permissions });
  } catch (err) {
    next(err);
  }
};

// Get single permission
export const getPermissionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const permission = await PermissionModel.getPermissionById(id);

    if (!permission) return res.status(404).json({ message: 'Permission not found' });

    res.json({ success: true, data: permission });
  } catch (err) {
    next(err);
  }
};

// Create permission
// export const createPermission = async (req, res, next) => {
//   try {
//     const { name, description } = req.body;
//     const permission = await PermissionModel.createPermission(name, description);
//     res.status(201).json({ success: true, data: permission });
//   } catch (err) {
//     next(err);
//   }
// };

// Update permission
export const updatePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const permission = await PermissionModel.updatePermission(id, name, description);

    if (!permission) return res.status(404).json({ message: 'Permission not found' });

    res.json({ success: true, data: permission });
  } catch (err) {
    next(err);
  }
};

// Delete permission
export const deletePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rowCount = await PermissionModel.deletePermission(id);

    if (rowCount === 0) return res.status(404).json({ message: 'Permission not found' });

    res.json({ success: true, message: 'Permission deleted successfully' });
  } catch (err) {
    next(err);
  }
};

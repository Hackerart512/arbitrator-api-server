import { Router } from 'express';
import * as roleController from './role.controller.js';
import { checkPermission } from '../auth/permission.middleware.js';
import authMiddleware from '../auth/auth.middleware.js';

const router = Router();


/* --------------------------
  Protected Routes 
----------------------------*/
router.use(authMiddleware); 

/**
 * Roles
 */
// Get all roles
router.get('/', checkPermission('view_roles'), roleController.getAllRoles);

// Get single role by id
router.get('/:id', checkPermission('view_roles'), roleController.getRoleById);

// Create new role
router.post('/', checkPermission('manage_roles'), roleController.createRole);

// Update role info
router.put('/:id', checkPermission('manage_roles'), roleController.updateRole);

// Delete a role
router.delete('/:id', checkPermission('manage_roles'), roleController.deleteRole);

/**
 * Permissions for a Role
 */
// Get permissions assigned to a role
router.get('/:id/permissions', checkPermission('manage_roles'), roleController.getRolePermissions);

// Assign permissions to a role
router.post('/:id/permissions', checkPermission('manage_roles'), roleController.assignPermissions);

// Remove permissions from a role
router.delete('/:id/permissions', checkPermission('manage_roles'), roleController.removePermissions);

export default router;

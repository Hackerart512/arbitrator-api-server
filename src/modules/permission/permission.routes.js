import express from 'express';
import * as PermissionController from './permission.controller.js';
import { checkPermission } from '../auth/permission.middleware.js';
import authMiddleware from '../auth/auth.middleware.js';
const router = express.Router();

// All routes are protected by authentication
router.use(authMiddleware);

// CRUD routes
router.get('/', checkPermission('view_permissions'), PermissionController.getAllPermissions);
router.get('/:id', checkPermission('view_permissions'), PermissionController.getPermissionById);
// router.post('/', checkPermission('manage_permissions'), PermissionController.createPermission);
router.put('/:id', checkPermission('manage_permissions'), PermissionController.updatePermission);
router.delete('/:id', checkPermission('manage_permissions'), PermissionController.deletePermission);

export default router;

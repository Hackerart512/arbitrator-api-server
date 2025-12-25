import express from 'express';
import * as UserController from './user.controller.js';
import authMiddleware from '../auth/auth.middleware.js';
import { checkPermission } from '../auth/permission.middleware.js';

const router = express.Router();

/* --------------------------
  Public Routes
----------------------------*/

// Login route
router.post('/login', UserController.login);

/* --------------------------
  Protected Routes 
----------------------------*/
// router.use(authMiddleware); 

// Admin-only CRUD operations
router.get('/',authMiddleware, checkPermission('view_users'), UserController.getUsers);
router.get('/:id',authMiddleware, checkPermission('view_users'), UserController.getUserById);
router.post('/',authMiddleware, checkPermission('manage_users'), UserController.createUser);
router.put('/:id',authMiddleware, checkPermission('manage_users'), UserController.updateUser);
router.delete('/:id',authMiddleware, checkPermission('manage_users'), UserController.deleteUser);

export default router;

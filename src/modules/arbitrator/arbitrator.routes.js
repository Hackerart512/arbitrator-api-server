import express from 'express';
import {
    submitArbitratorProfile,
    getPendingArbitrators,
    approveArbitrator,
    rejectArbitrator,
    getSelectableArbitrators
} from './arbitrator.controller.js';

import authMiddleware from '../auth/auth.middleware.js';
import { checkPermission } from '../auth/permission.middleware.js';

const router = express.Router();

/* --------------------------
  Protected Routes 
----------------------------*/



router.post('/send-varification-code',registerArbitrator );
router.post('/verifyemail-setpassword',verifyEmailAndSetPassword );

router.use(authMiddleware); 

router.post('/onboarding',checkPermission('view_arbitrator'), submitArbitratorProfile);
router.get('/pending',checkPermission('manage_arbitrator'), getPendingArbitrators);
router.post('/approve/:id',checkPermission('manage_arbitrator'), approveArbitrator);
router.post('/reject/:id',checkPermission('manage_arbitrator'), rejectArbitrator);
router.get('/selectable',checkPermission('view_arbitrator'), getSelectableArbitrators);
router.get('/update-onboarding',checkPermission('view_arbitrator'), updateProfileWithLog);

export default router;

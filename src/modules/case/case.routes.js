import express from 'express';
import {
    createCase,
    addCaseParty,
    uploadCaseDocument,
    recordCasePayment
} from './case.controller.js';

import authMiddleware from '../auth/auth.middleware.js';
import { checkPermission } from '../auth/permission.middleware.js';

const router = express.Router();

/* --------------------------
  Protected Routes 
----------------------------*/
  
router.post('/create',authMiddleware,checkPermission('create_case'),createCase);

router.post('/caseId/parties', authMiddleware,checkPermission('case_party_add'), addCaseParty);
router.post('/:caseId/documents', authMiddleware,checkPermission('case_doc_upload'), uploadCaseDocument);
router.post('/:caseId/payment', authMiddleware,checkPermission('case_payment'), recordCasePayment);

export default router;

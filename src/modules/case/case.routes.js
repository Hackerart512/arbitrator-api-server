import express from 'express';
import {
  createCase,
  addCaseParty,
  uploadCaseDocument,
  getCaseArbitrators,
  arbitratorsSortlist,
  verifyCasePayment,
  createCasePaymentOrder,
  arbitratorResponse
} from './case.controller.js';

import authMiddleware from '../auth/auth.middleware.js';
import { checkPermission } from '../auth/permission.middleware.js';

const router = express.Router();

/* --------------------------
  Protected Routes 
----------------------------*/

router.post('/create', authMiddleware, checkPermission('create_case'), createCase);

router.post('/caseId/parties', authMiddleware, checkPermission('case_party_add'), addCaseParty);
router.post('/:caseId/documents', authMiddleware, checkPermission('case_doc_upload'), uploadCaseDocument);
router.post('/parties/by-role', authMiddleware, checkPermission('case_party_add'), getPartiesByRole);

router.post('/:caseId/payment', authMiddleware, checkPermission('case_payment'), createCasePaymentOrder);
router.post('/:caseId/payment/verify', authMiddleware, checkPermission('case_payment'), verifyCasePayment);


//  Claimant shortlists arbitrators
router.post(
  '/:caseId/arbitrators/shortlist',
  authMiddleware,
  checkPermission('case_arbitrators'),
  arbitratorsShortlist
);

//  Get shortlisted arbitrators (for Claimant / Respondent / Admin)
router.get(
  '/:caseId/arbitrators',
  authMiddleware,
  checkPermission('case_arbitrators'),
  getCaseArbitrators
);

//  Respondent approves or rejects the shortlist
router.post(
  '/:caseId/arbitrators/respondent-action',
  authMiddleware,
  checkPermission('respondent_arbitrator_decision'),
  respondentArbitratorAction
);

//  Arbitrator accepts or rejects assignment
router.post(
  '/:caseId/arbitrators/:arbitratorId/action',
  authMiddleware,
  checkPermission('arbitrator_response'),
  arbitratorResponse
);





export default router;

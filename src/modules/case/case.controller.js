import CaseModel from './case.model.js';
import RazorpayService from '../razorpay/razorpay.service.js';


export const createCase = async (req, res, next) => {
    try {
        const data = await CaseModel.createCase(
            req.user.userId,
            req.body
        );
        res.status(201).json(data);

    } catch (err) {
        next(err);
    }

};

export const addCaseParty = async (req, res, next) => {
    try {
        const data = await CaseModel.addParty(
            req.params.caseId,
            req.user.userId,
            req.body
        );
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

export const uploadCaseDocument = async (req, res, next) => {
    try {
        const data = await CaseModel.addDocument(
            req.params.caseId,
            req.user.userId,
            req.body
        );
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

// export const recordCasePayment = async (req, res, next) => {
//     try {
//         await CaseModel.addPayment(
//             req.params.caseId,
//             req.user.userId,
//             req.body
//         );
//         res.status(201).json({ success: true, message: 'Case filed successfully' });
//     } catch (err) {
//         next(err);
//     }
// };

export const createCasePaymentOrder = async (req, res, next) => {
    try {
        const { caseId } = req.params;
        const amount = 5000;
        const order = await RazorpayService.createOrder({
            amount,
            receipt: `case_${caseId}`,
            notes: { caseId }
        });
        res.status(201).json({ success: true, message: 'Case filed successfully', order });
    } catch (err) {
        next(err);
    }

};

export const verifyCasePayment = async (req, res, next) => {
    try {
        const { caseId } = req.params;
        await CaseModel.verifyCasePayment(
            caseId,
            req.body
        );
        res.status(201).json({ success: true, message: 'Case filed successfully' });
    } catch (err) {
        next(err);
    }
};

export const getPartiesByRole = async (req, res, next) => {
    try {
        await CaseModel.getPartiesByRole(
            req.query.role
        );
        res.status(201).json({ success: true, message: 'Parties get successfully' });
    } catch (err) {
        next(err);
    }
};

export const arbitratorsShortlist = async (req, res, next) => {
    try {
        const { caseId } = req.params;
        const { arbitratorIds } = req.body;
        const userId = req.user.id;

        if (!Array.isArray(arbitratorIds) || arbitratorIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one arbitrator must be selected'
            });
        }

        if (arbitratorIds.length > 3) {
            return res.status(400).json({
                success: false,
                message: 'You can shortlist maximum 3 arbitrators'
            });
        }

        // Save shortlist
        await CaseModel.arbitratorsShortlist({
            caseId,
            arbitratorIds,
            selectedBy: userId
        });

        res.status(201).json({
            success: true,
            message: 'Arbitrators shortlisted successfully'
        });

    } catch (err) {
        next(err);
    }
};



export const getCaseArbitrators = async (req, res, next) => {
    try {
        const { caseId } = req.params;
        const { status } = req.query;

        // const caseData = await CaseModel.getCaseById(caseId);
        // if (!caseData) {
        //     return res.status(404).json({
        //         success: false,
        //         message: 'Case not found'
        //     });
        // }

        const arbitrators = await CaseModel.getCaseArbitrators(caseId, status);

        res.status(201).json({
            success: true,
            data: arbitrators
        });
    } catch (err) {
        next(err);
    }
};

export const respondentArbitratorAction = async (req, res, next) => {
    try {
        const { caseId } = req.params;
        const { action, reason } = req.body;

        if (!['approved', 'rejected'].includes(action)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid action'
            });
        }

        await CaseModel.respondentDecision({
            caseId,
            action,
            userId: req.user.id,
            reason
        });

        res.status(201).json({
            success: true,
            message: `Shortlist ${action} by respondent`
        });
    } catch (err) {
        next(err);
    }
};

export const arbitratorResponse = async (req, res, next) => {
    try {
        const { caseId, arbitratorId } = req.params;
        const { action } = req.body;

        if (!['accepted', 'rejected'].includes(action)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid action'
            });
        }

        await CaseModel.arbitratorDecision({
            caseId,
            arbitratorId,
            action,
            userId: req.user.id
        });

        res.json({
            success: true,
            message: `Arbitrator ${action} the case`
        });
    } catch (err) {
        next(err);
    }
};



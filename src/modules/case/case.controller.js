import CaseModel from './case.model.js';

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

export const recordCasePayment = async (req, res, next) => {
    try {
        await CaseModel.addPayment(
            req.params.caseId,
            req.user.userId,
            req.body
        );
        res.status(201).json({ success: true, message: 'Case filed successfully' });
    } catch (err) {
        next(err);
    }
};
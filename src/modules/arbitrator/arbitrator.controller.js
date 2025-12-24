import ArbitratorModel from './arbitrator.model.js';

export const registerArbitrator = async (req, res, next) => {
  try {
    const user = await ArbitratorModel.registerArbitrator(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const verifyEmailAndSetPassword = async (req, res, next) => {
  try {
    const user = await ArbitratorModel.verifyEmailAndSetPassword(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};


export const submitArbitratorProfile = async (req, res) => {
    try {
        const arbitrator = await ArbitratorModel.create({
            user_id: req.user.id,
            ...req.body
        });

        res.status(201).json({
            message: 'Arbitrator profile submitted for review',
            arbitrator
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getPendingArbitrators = async (req, res) => {
    const arbitrators = await ArbitratorModel.findPending();
    res.json(arbitrators);
};

export const approveArbitrator = async (req, res) => {
    const arbitrator = await ArbitratorModel.approve(
        req.params.id,
        req.user.id
    );

    res.json({
        message: 'Arbitrator approved successfully',
        arbitrator
    });
};

export const rejectArbitrator = async (req, res) => {
    const arbitrator = await ArbitratorModel.reject(
        req.params.id,
        req.body.reason
    );

    res.json({
        message: 'Arbitrator rejected',
        arbitrator
    });
};

export const getSelectableArbitrators = async (req, res) => {
    const arbitrators = await ArbitratorModel.findApproved();
    res.json(arbitrators);
};


export const updateProfileWithLog = async (req, res, next) => {
  try {
    const user = await ArbitratorModel.updateProfileWithLog(req.user.id, req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
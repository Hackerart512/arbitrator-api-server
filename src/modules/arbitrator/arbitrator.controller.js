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


export const submitArbitratorProfile = async (req, res, next) => {
  try {
    const arbitrator = await ArbitratorModel.submitArbitratorProfile(req.user.id, req.body);

    res.status(201).json({
      message: 'Arbitrator profile submitted for review',
      arbitrator
    });
  } catch (err) {
    next(err);
  }
};

export const getPendingArbitrators = async (req, res, next) => {

  try {

    const arbitrators = await ArbitratorModel.findPending();
    res.status(201).json(arbitrators);

  } catch (err) {
    next(err);
  }

};

export const approveArbitrator = async (req, res, next) => {

  try {

    const arbitrator = await ArbitratorModel.approve(
      req.params.id,
      req.user.id
    );

    res.status(201).json({
      message: 'Arbitrator approved successfully',
      arbitrator
    });

  } catch (err) {
    next(err);
  }

};

export const rejectArbitrator = async (req, res, next) => {

  try {
    const arbitrator = await ArbitratorModel.reject(
      req.params.id,
      req.body.reason
    );

    res.status(201).json({
      message: 'Arbitrator rejected',
      arbitrator
    });

  } catch (err) {
    next(err);
  }
};

export const getSelectableArbitrators = async (req, res, next) => {
  try {
    const arbitrators = await ArbitratorModel.findApproved(req.query);
    res.status(201).json(arbitrators);
  } catch (err) {
    next(err);
  }
};

export const updateProfileWithLog = async (req, res, next) => {
  try {
    const user = await ArbitratorModel.updateProfileWithLog(req.user.id, req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
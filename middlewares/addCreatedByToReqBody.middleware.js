const { minimizeAccount } = require('../api/account/account.interface.js');
const { createError, noop } = require('../services/utils.service.js');
const { getUserFromExpressReq } = require('../api/auth/auth.controller.js');

function addCreatedByToReqBody(req, res, next) {
  noop(res);
  const user = getUserFromExpressReq(req);
  const createdBy = user ? minimizeAccount(user) : { err: 'unknown user' };
  req.body.createdBy = createdBy;
  next();
}

module.exports = { addCreatedByToReqBody };
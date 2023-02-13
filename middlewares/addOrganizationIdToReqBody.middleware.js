const { noop } = require('../services/utils.service.js');

function addOrganizationIdToReqBody(req, res, next) {
  noop(res);
  req.body._organizationId = req.params.organizationId;
  next();
}

module.exports = { addOrganizationIdToReqBody };
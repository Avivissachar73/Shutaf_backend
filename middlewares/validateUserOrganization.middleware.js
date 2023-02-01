const { organizationStatuses, organizationRoles } = require('../services/const.service.js');
const { createError } = require('../services/utils.service.js');
const { getUserFromExpressReq } = require('../api/auth/auth.controller.js');


const validateOrganization = (req, res, next) => {
    const orgInUser = _getOrgFromReq(req);
    if (!orgInUser) return res.status(401).send(createError('authorizationError: user not allowd', 401));
    next();
}

const validateOrganizationMember = (req, res, next) => {
    const orgInUser = _getOrgFromReq(req);
    if (orgInUser?.status !== organizationStatuses.approved) return res.status(401).send(createError('authorizationError: user not allowd', 401));
    next();
}

function _getOrgFromReq(req) {
    const user = getUserFromExpressReq(req);
    const orgId = req.params.organizationId || req.params.id || req.body._id;
    if (orgId === 'public') return { status: organizationStatuses.approved };
    const orgInUser = user?.organizations?.find(c => c._id === orgId);
    return orgInUser;
}

module.exports = { validateOrganization, validateOrganizationMember };

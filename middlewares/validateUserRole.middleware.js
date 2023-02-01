const { userRoles, userRolesMap } = require('../services/const.service.js');
const { createError } = require('../services/utils.service.js');
const { getUserFromExpressReq } = require('../api/auth/auth.controller.js');
const { validateUserRole, validateUserMinRole, validateCreator, validateCreatorOrAdmin } = require('../services/userValidation.service');


const validateRole = (...roles) => {
    return (req, res, next) => {
        const user = getUserFromExpressReq(req);
        for (const role of roles) {
            if (validateUserRole(user, role)) return next();
        }
        res.status(401).send(createError('authorizationError: missing required roles for user: ' + roles.join(', '), 401));
    }
}
exports.validateRole = validateRole;

exports.validateUser = validateRole(userRoles.user);
exports.validateAdmin = validateRole(userRoles.admin);


const validateMinRole = (role) => {
    return (req, res, next) => {
        const user = getUserFromExpressReq(req);
        if (validateUserMinRole(user, role)) return next();
        res.status(401).send(createError('authorizationError: missing min role for user: ' + role, 401));
    }
}
exports.validateMinRole = validateMinRole;


const validateSelfOrRole = (role) => {
    return (req, res, next) => {
        const user = getUserFromExpressReq(req);
        if (_validateSelf(req) || validateUserRole(user, role)) return next();
        res.status(401).send(createError('Unauthorized', 401));
    }
}
exports.validateSelfOrRole = validateSelfOrRole;
exports.validateSelfOrAdmin = validateSelfOrRole(userRoles.admin);

const validateSelfOrMinRole = (role) => {
    return (req, res, next) => {
        const user = getUserFromExpressReq(req);
        if (_validateSelf(req) || validateUserMinRole(user, role)) return next();
        res.status(401).send(createError('Unauthorized', 401));
    }
}
exports.validateSelfOrMinRole = validateSelfOrMinRole;


function _validateSelf(req) {
    const user = getUserFromExpressReq(req);
    const id = req.params.id || req.body._id;
    return id === user._id;
}
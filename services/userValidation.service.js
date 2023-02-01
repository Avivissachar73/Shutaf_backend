
const { userRoles, userRolesMap, organizationRoles } = require('./const.service.js');


function validateUserRole(user, role) {
  if (Array.isArray(user.roles)) {
      if (user.roles.includes(role)) return true;
  } else if (user.role === role) return true;
  return false;
}
function validateUserMinRole(user, role) {
  const userRoleVal = userRolesMap[user.role];
  const reqRoleVal = userRolesMap[role];
  return userRoleVal >= reqRoleVal;
}

function validateCreator(item, user) {
  return (item.createdBy?._id === user._id);
}

function validateCreatorOrRole(item, user, role) {
  return (validateCreator(item, user) || validateUserRole(user, role));
}

function validateCreatorOrAdmin(item, user) {
  return validateCreatorOrRole(item, user, userRoles.admin);
}


function validateCreatorOrOrgRole(item, user, role) {
  return (validateCreator(item, user) || validateUserOrgRole(user, item.organizationId, role));
}

function validateUserOrgRole(user, organizationId, role) {
  const orgInUser = user?.organizations?.find(c => c._id === organizationId);
  return orgInUser?.roles?.includes(role);
}

function validateUserOrgAdmin(user, organizationId, role) {
  return validateUserOrgRole(user, organizationId, organizationRoles.admin);
}

function validateCreatorOrOrgAdmin(item, user) {
  return validateCreatorOrOrgRole(item, user, organizationRoles.admin);
}

module.exports = {
  validateUserRole,
  validateUserMinRole,
  validateCreator,
  validateCreatorOrAdmin,

  validateCreatorOrOrgRole,
  validateUserOrgRole,
  validateUserOrgAdmin,
  validateCreatorOrOrgAdmin
}
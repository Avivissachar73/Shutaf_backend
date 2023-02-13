const { userRoles, organizationRoles, organizationStatuses } = require('../../services/const.service');
const { validateCreatorOrAdmin, validateCreatorOrOrgAdmin, validateUserOrgAdmin, validateAppAdmin } = require('../../services/userValidation.service');
const { fixDeepQuery, createError } = require('../../services/utils.service');
const { getUserFromExpressReq, updateAccuntSessionData, getLoggedUser } = require('../auth/auth.controller.js');
const { minimizeAccount } = require('../account/account.interface');
const accountService = require('../account/account.service');
const { minimizeOrg } = require('./organization.interface');
const organizationService = require('./organization.service');
const _errMsg = require('../../services/utils.service').getCreateErrMsg('organization.controller');

async function add(req, res, next) {
  try {
    const addedOrg = await organizationService.add(req.body);

    const account = await accountService.get(addedOrg.createdBy._id);
    if (!account.organizations) account.organizations = [];
    account.organizations.push({
      ...minimizeOrg(addedOrg),
      roles: [
        organizationRoles.admin,
        organizationRoles.creator
      ],
      status: organizationStatuses.approved,
      approverId: account._id.toString()
    });
    await accountService.update(account);
    await updateAccuntSessionData(req);

    res.send(addedOrg);
  } catch(err) {
    next({msg: _errMsg(`Couldn't add organization`, 'add', err)});
  }
}

async function update(req, res, next) {
  try {
    delete req.body.members;
    delete req.body.loggedAccountData;

    const isValid = await validateOrgAuth(req.body._id, req);
    if (!isValid) return res.status(401).send(createError('noAuthToEditOrganizationError', 401, 'Unauthorized, cant edit organization'));

    const updatedOrg = await organizationService.update(req.body);
    res.send(updatedOrg);
  } catch(err) {
    next({msg: _errMsg(`Couldn't update organization`, 'update', err)});
  }
}

async function remove(req, res, next) {
  try {
    const id = req.params.id;

    const isValid = await validateOrgAuth(id, req);
    if (!isValid) return res.status(401).send(createError('noAuthToRemoveOrganizationError', 401, 'Unauthorized, cant remove organization'));

    await organizationService.remove(id);
    res.send({msg: `removed organization with id: ${id}`});
  } catch(err) {
    next({msg: _errMsg(`Couldn't remove organization`, 'remove', err)});
  }
}

async function get(req, res, next) {
  try {
    const id = req.params.id;
    const organization = await organizationService.get(id);
    const orgToShow = await _getOrganizationToShow(organization, getUserFromExpressReq(req));
    res.send(orgToShow);
  } catch(err) {
    next({msg: _errMsg(`Couldn't get organization`, 'get', err)});
  }
}

async function query(req, res, next) {
  try {
    const user = await getLoggedUser(req);
    const orgIds = user.organizations?.filter(c => [organizationStatuses.approved, organizationStatuses.pending].includes(c.status)).map(c => c._id) || [];
    const organizations = await organizationService.query(fixDeepQuery(req.query), orgIds);
    organizations.items = await Promise.all(organizations.items.map(c => _getOrganizationToShow(c, getUserFromExpressReq(req), true)));
    res.send(organizations);
  } catch(err) {
    next({msg: _errMsg(`Couldn't query organizations`, 'query', err)});
  }
}


async function inviteAccount(req, res, next) {
  try {
    const { organizationId } = req.params;
    const { accountId, role } = req.body

    const isRegValid = await validateOrgAuth(organizationId, req);
    if (!isRegValid) return res.status(401).json(createError('noAuthToInviteUserToOrganizationError', 401, 'Unauthorized, invite account to organization'));

    const account = await accountService.get(accountId);
    const organization = await organizationService.get(organizationId);
    
    const organizationToUser = {
      ...minimizeOrg(organization),
      roles: [Object.values(organizationRoles).includes(role)? role : organizationRoles.user],
      status: organizationStatuses.pending,
      approverId: account._id.toString()
    };
    if (!account.organizations) account.organizations = [];
    const idxInUser = account.organizations.findIndex(c => c._id === organizationToUser._id);
    if (idxInUser === -1) account.organizations.push(organizationToUser);
    else account.organizations.splice(idxInUser, 1, organizationToUser);
    await accountService.update(account);
    res.send({message: 'seccess'});
  } catch(err) {
    next({msg: _errMsg(`Couldn't invite account to organization`, 'inviteAccount', err)});
  }
}

async function changeAccountStatusOnOrg(req, res, next) {
  try {
    const { organizationId } = req.params;
    const { accountId, status } = req.body;
    const account = await accountService.get(accountId);
    
    const orgOnAccount = account.organizations.find(c => c._id === organizationId);
    const isRegValid = await validateOrgAuth(orgOnAccount._id, req);
    if (!isRegValid && (orgOnAccount.approverId !== getUserFromExpressReq(req)._id)) return res.status(401).json(createError('noAuthToChangeAccountOrganizationStatusError', 401, 'Unauthorized, cant change account status in organization'));
    
    orgOnAccount.status = status;
    await accountService.update(account);

    if (accountId === getUserFromExpressReq(req)._id) await updateAccuntSessionData(req);

    res.send({message: 'seccess'});
  } catch(err) {
    next({msg: _errMsg(`Couldn't update user status on organization`, 'changeAccountStatusOnOrg', err)});
  }
}

async function changeAccountRolesOnOrg(req, res, next) {
  try {
    const { organizationId } = req.params;
    const { accountId, roles } = req.body;
    const account = await accountService.get(accountId);
    // const organization = await organizationService.get(organizationId);
    const orgOnAccount = account.organizations.find(c => c._id === organizationId);
    const isRegValid = await validateOrgAuth(orgOnAccount._id, req);
    if (!isRegValid) return res.status(401).json(createError('noAuthToChangeAccountOrganizationRolesError', 401, 'Unauthorized, cant change account roles in organization'));
    orgOnAccount.roles = roles;
    await accountService.update(account);

    if (accountId === getUserFromExpressReq(req)._id) await updateAccuntSessionData(req);

    res.send({message: 'seccess'});
  } catch(err) {
    next({msg: _errMsg(`Couldn't update user roles on organization`, 'changeAccountRolesOnOrg', err)});
  }
}

async function removeAccountFromOrg(req, res, next) {
  try {
    const { organizationId } = req.params;
    const { accountId } = req.body

    const isRegValid = await validateOrgAuth(organizationId, req);
    if (!isRegValid) return res.status(401).json(createError('noAuthToRemoveUserFromOrganizationError', 401, 'Unauthorized, cant remove account from organization'));

    const account = await accountService.get(accountId);
    const idxInUser = account.organizations.findIndex(c => c._id === organizationId);
    if (idxInUser !== -1) account.organizations.splice(idxInUser, 1);
    await accountService.update(account);
    if (accountId === getUserFromExpressReq(req)._id) await updateAccuntSessionData(req);
    res.send({message: 'seccess'});
  } catch(err) {
    next({msg: _errMsg(`Couldn't remove account from organization`, 'removeAccountFromOrg', err)});
  }
}

async function validateOrgAuth(orgId, req) {
  if (validateAppAdmin(getUserFromExpressReq(req))) return true;
  // const org = await organizationService.get(orgId);
  return validateUserOrgAdmin(getUserFromExpressReq(req), orgId);
}


module.exports = {
  query,
  get,
  remove,
  update,
  add,
  inviteAccount,
  changeAccountStatusOnOrg,
  changeAccountRolesOnOrg,
  removeAccountFromOrg
}



// better do with mongo agregation;
async function _getOrganizationToShow(org, account, isOnlyApprovedAccounts = false) {
  const id = org._id.toString();
  let loggedAccountData = null;
    let members = await accountService.basicQuery({ 'organizations._id': id });
    if (isOnlyApprovedAccounts) members.items = members.items.filter(c => c.organizations.find(_ => _._id.toString() === org._id.toString()).status === organizationStatuses.approved)
    org.members = members.items.map(c => {
      const orgInAccount = c.organizations.find(o => o._id === id);
      const currAccountData = {roles: orgInAccount.roles, status: orgInAccount.status}
      if (c._id.toString() === account._id) loggedAccountData = currAccountData;
      return {...minimizeAccount(c), ...currAccountData};
    });
    org.loggedAccountData = loggedAccountData;
    return org;
}
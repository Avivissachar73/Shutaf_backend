const { userRoles, organizationRoles, organizationStatuses } = require('../../services/const.service');
const { validateCreatorOrAdmin, validateCreatorOrOrgAdmin, validateUserOrgAdmin, validateAppAdmin } = require('../../services/userValidation.service');
const { fixDeepQuery, createError } = require('../../services/utils.service');
const { getUserFromExpressReq, updateAccuntSessionData } = require('../auth/auth.controller.js');
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
    account.organizations.push({...minimizeOrg(addedOrg), roles: [organizationRoles.admin, organizationRoles.creator], status: organizationStatuses.approved, approverId: account._id.toString()});
    await accountService.update(account);
    req.session.userData.user = account;

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
    if (!isValid) return res.status(401).send(createError('noAuthToUEditOrganizationError', 401, 'Unauthorized, cant edit organization'));

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
    let loggedAccountData = null;
    const members = await accountService.basicQuery({ 'organizations._id': organization._id.toString() });  
    organization.members = members.items.map(c => {
      const orgInAccount = c.organizations.find(o => o._id === id);
      const currAccountData = {roles: orgInAccount.roles, status: orgInAccount.status}
      if (c._id.toString() === getUserFromExpressReq(req)._id.toString()) loggedAccountData = currAccountData;
      return {...minimizeAccount(c), ...currAccountData};
    });
    organization.loggedAccountData = loggedAccountData;
    res.send(organization);
  } catch(err) {
    next({msg: _errMsg(`Couldn't get organization`, 'get', err)});
  }
}

async function query(req, res, next) {
  try {
    const orgIds = getUserFromExpressReq(req).organizations?.filter(c => c.status !== organizationStatuses.declined).map(c => c._id) || [];
    const organizations = await organizationService.query(fixDeepQuery(req.query), orgIds);
    res.send(organizations);
  } catch(err) {
    next({msg: _errMsg(`Couldn't query organizations`, 'query', err)});
  }
}


async function inviteAccount(req, res, next) {
  try {
    const { accountId, organizationId } = req.params;
    const account = await accountService.get(accountId);
    const organization = await organizationService.get(organizationId);
    const organizationToUser = {...minimizeOrg(organization), roles: [organizationRoles.user], status: organizationStatuses.pending, approverId: account._id.toString()};
    if (!account.organizations) account.organizations = [];
    const idxInUser = account.organizations.findIndex(c => c._id === organizationToUser._id);
    if (idxInUser === -1) account.organizations.push(organizationToUser);
    else account.organizations.splice(idxInUser, 1, organizationToUser);
    await accountService.update(account);
    res.send({message: 'seccess'});
  } catch(err) {
    next({msg: _errMsg(`Couldn't invite account to organization`, 'invite', err)});
  }
}

async function changeAccountStatusOnOrg(req, res, next) {
  try {
    const { accountId, organizationId } = req.params;
    const { newStatus } = req.body;
    const account = await accountService.get(accountId);
    // const organization = await organizationService.get(organizationId);
    const orgOnAccount = account.organizations.find(c => c._id === organizationId);
    const isRegValid = await validateOrgAuth(orgOnAccount._id, req);
    if (!isRegValid && (orgOnAccount.approverId !== getUserFromExpressReq(req)._id)) return res.status(401).json(createError('noAuthToChangeAccountOrganizationStatusError', 401, 'Unauthorized, cant change account status in organization'));
    orgOnAccount.status = newStatus;
    await accountService.update(account);

    if (accountId === getUserFromExpressReq(req)._id) await updateAccuntSessionData(req);

    res.send({message: 'seccess'});
  } catch(err) {
    next({msg: _errMsg(`Couldn't update user status on organization`, 'changeAccountStatusOnOrg', err)});
  }
}


async function validateOrgAuth(orgId, req) {
  if (validateAppAdmin(getUserFromExpressReq(req))) return true;
  const org = await organizationService.get(orgId);
  return validateUserOrgAdmin(org, getUserFromExpressReq(req))
}


module.exports = {
  query,
  get,
  remove,
  update,
  add,
  inviteAccount,
  changeAccountStatusOnOrg
}
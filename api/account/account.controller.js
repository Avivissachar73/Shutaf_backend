const { validateAppAdmin } = require('../../services/userValidation.service');
const { fixDeepQuery } = require('../../services/utils.service');
const { getUserFromExpressReq, updateAccuntSessionData, doLogout } = require('../auth/auth.controller');
const organizationService = require('../organization/organization.service');
const { minimizeAccount } = require('./account.interface');
const accountService = require('./account.service');
const _errMsg = require('../../services/utils.service').getCreateErrMsg('account.controller');
const loggerService = require('../../services/logger.service.js');

async function add(req, res, next) {
  try {
    const addedAccount = await accountService.add(req.body);
    res.send(addedAccount);
  } catch(err) {
    next({msg: _errMsg(`Couldn't add account`, 'add', err)});
  }
}

async function update(req, res, next) {
  try {
    const accountToEdit = req.body;
    // dont let user edit its roles or organizations, can use postman or such to edit those params and give theselves full admin system permissions; 
    if (!validateAppAdmin(getUserFromExpressReq(req))) {
      const oldAccount = await accountService.get(accountToEdit._id);
      if (
        ('roles' in accountToEdit && (JSON.stringify(oldAccount.roles) !== JSON.stringify(accountToEdit.roles))) ||
        ('organizations' in accountToEdit && (JSON.stringify(oldAccount.organizations) !== JSON.stringify(accountToEdit.organizations))) ||
        ('blocked' in accountToEdit && (accountToEdit.blocked !== oldAccount.blocked))
      ) {
        await accountService.blockAccount(accountToEdit._id);
        await doLogout(req, res);
        const msg = 'Security issue: user tried to preform unauthorized action, tried to change his system roles';
        await loggerService.warn('accountBlocked', { msg, account: minimizeAccount(oldAccount) });
        return res.status(403).send({ err: 'SecurityWarnBlockedUser', msg });
      }
      delete accountToEdit.roles;
      delete accountToEdit.organizations;
    }

    const updatedAccount = await accountService.update(accountToEdit);
    if (updatedAccount._id.toString() === getUserFromExpressReq(req)._id) {
      await updateAccuntSessionData(req);
    }
    res.send(updatedAccount);
  } catch(err) {
    next({msg: _errMsg(`Couldn't update account`, 'update', err)});
  }
}

async function remove(req, res, next) {
  try {
    const id = req.params.id;
    await accountService.remove(id);
    res.send({msg: `removed account with id: ${id}`});
  } catch(err) {
    next({msg: _errMsg(`Couldn't remove account`, 'remove', err)});
  }
}

async function get(req, res, next) {
  try {
    const id = req.params.id;
    const account = await accountService.get(id);
    account.organizations = await Promise.all(account.organizations.map(async c => ({
      ...c,
      name: (await organizationService.get(c._id))?.name
    })));
    res.send(account);
  } catch(err) {
    next({msg: _errMsg(`Couldn't get account`, 'get', err)});
  }
}

async function query(req, res, next) {
  try {
    const items = await accountService.query(fixDeepQuery(req.query));
    res.send(items);
  } catch(err) {
    next({msg: _errMsg(`Couldn't query items`, 'query', err)});
  }
}


module.exports = {
  query,
  get,
  remove,
  update,
  add
}
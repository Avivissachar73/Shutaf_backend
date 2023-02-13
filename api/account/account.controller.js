const { fixDeepQuery } = require('../../services/utils.service');
const { getUserFromExpressReq, updateAccuntSessionData } = require('../auth/auth.controller');
const organizationService = require('../organization/organization.service');
const accountService = require('./account.service');
const _errMsg = require('../../services/utils.service').getCreateErrMsg('account.controller');

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
    const updatedAccount = await accountService.update(req.body);
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
      name: (await organizationService.get(c._id)).name
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
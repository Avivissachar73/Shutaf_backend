const dbService = require('../../services/db.service');
const { validateType } = require('../../services/interface.service');
const { account: accountScheme } = require('./account.interface');

const COLLECTION_NAME = 'account';

async function add(account) {
  validateType(accountScheme, account, true);
  return dbService.add(COLLECTION_NAME, account);
}
async function update(account) {
  return dbService.update(COLLECTION_NAME, account);
}
async function remove(accountId) {
  return dbService.remove(COLLECTION_NAME, accountId);
}
async function get(accountId) {
  const account = await dbService.get(COLLECTION_NAME, accountId);
  delete account.password;
  return account;
}
async function query(filterBy = {}) {
  const criteria = dbService.buildBasicSearchFilterBy(filterBy?.filter, ['username', 'email']);
  const accountsRes = await dbService.query(COLLECTION_NAME, criteria, filterBy.sort, filterBy.pagination);
  accountsRes.items.forEach(c => delete c.password);
  return accountsRes;
}

async function basicQuery(criteria, sort, pagination) {
  return dbService.query(COLLECTION_NAME, criteria, sort, pagination);
}

module.exports = {
  col: COLLECTION_NAME,
  add,
  update,
  remove,
  query,
  get,
  basicQuery
}
const dbService = require('../../services/db.service');

const makeColName = (colName) => `_DYNAMIC_DB_COLLECTION__${colName}_`;

async function add(colName, item) {
  return dbService.add(makeColName(colName), item);
}
async function update(colName, item) {
  return dbService.update(makeColName(colName), item);
}
async function remove(colName, itemId) {
  return dbService.remove(makeColName(colName), itemId);
}
async function get(colName, itemId) {
  return dbService.get(makeColName(colName), itemId);
}
async function query(colName, filterBy) {
  const criteria = dbService.buildBasicSearchFilterBy(filterBy.filter, []);
  return dbService.query(makeColName(colName), criteria, filterBy.sort, filterBy.pagination);
}

module.exports = {
  add,
  update,
  remove,
  query,
  get,
}
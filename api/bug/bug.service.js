const dbService = require('../../services/db.service');
const { validateType, cleanItem } = require('../../services/interface.service');
const { bugInterface } = require('./bug.interface');

const COLLECTION_NAME = 'bug';

async function add(bug) {
  cleanItem(bug, bugInterface);
  validateType(bugInterface, bug, true, true);
  return dbService.add(COLLECTION_NAME, bug);
}
async function update(bug) {
  cleanItem(bug, bugInterface);
  validateType(bugInterface, bug, true, true);
  return dbService.update(COLLECTION_NAME, bug);
}
async function remove(bugId) {
  return dbService.remove(COLLECTION_NAME, bugId);
}
async function get(bugId) {
  const bug = await dbService.get(COLLECTION_NAME, bugId);
  return bug;
}
async function query(filterBy = {}) {
  const criteria = dbService.buildBasicSearchFilterBy(filterBy?.filter, ['title', 'desc']);
  const bugRes = await dbService.query(COLLECTION_NAME, criteria, filterBy.sort, filterBy.pagination);
  return bugRes;
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
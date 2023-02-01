const dbService = require('../../services/db.service');
const { validateType } = require('../../services/interface.service');
const exampleScheme = require('./example.interface').exampleInterface;

const COLLECTION_NAME = 'example_collection';

async function add(item) {
  validateType(exampleScheme, item, true);
  return dbService.add(COLLECTION_NAME, item);
}
async function update(item) {
  validateType(exampleScheme, item, true);
  return dbService.update(COLLECTION_NAME, item);
}
async function remove(itemId) {
  return dbService.remove(COLLECTION_NAME, itemId);
}
async function get(itemId) {
  return dbService.get(COLLECTION_NAME, itemId);
}
async function query(filterBy) {
  const criteria = dbService.buildBasicSearchFilterBy(filterBy.filter, ['key']);
  return dbService.query(COLLECTION_NAME, criteria, filterBy.sort, filterBy.pagination);
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
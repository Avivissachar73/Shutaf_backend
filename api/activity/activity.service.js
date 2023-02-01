const dbService = require('../../services/db.service');
const { validateType } = require('../../services/interface.service');
const activityScheme = require('./activity.interface').activityInterface;

const COLLECTION_NAME = 'activity';

async function add(activity) {
  validateType(activityScheme, activity, true);
  return dbService.add(COLLECTION_NAME, activity);
}
async function update(activity) {
  validateType(activityScheme, activity, true);
  return dbService.update(COLLECTION_NAME, activity);
}
async function remove(activityId) {
  return dbService.remove(COLLECTION_NAME, activityId);
}
async function get(activityId) {
  return dbService.get(COLLECTION_NAME, activityId);
}
async function query(filterBy) {
  const criteria = dbService.buildBasicSearchFilterBy(filterBy.filter, ['name', 'desc']);
  return dbService.query(COLLECTION_NAME, criteria, filterBy.sort, filterBy.pagination);
}

module.exports = {
  col: COLLECTION_NAME,
  add,
  update,
  remove,
  query,
  get,
}
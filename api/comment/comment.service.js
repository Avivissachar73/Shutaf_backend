const dbService = require('../../services/db.service');
const { validateType } = require('../../services/interface.service');
const commentScheme = require('./comment.interface').commentInterface;

const COLLECTION_NAME = 'comment';

async function add(comment) {
  validateType(commentScheme, comment, true);
  return dbService.add(COLLECTION_NAME, comment);
}
async function update(comment) {
  validateType(commentScheme, comment, true);
  return dbService.update(COLLECTION_NAME, comment);
}
async function remove(commentId) {
  return dbService.remove(COLLECTION_NAME, commentId);
}
async function get(commentId) {
  return dbService.get(COLLECTION_NAME, commentId);
}
async function query(filterBy = {}) {
  const criteria = {
    ...dbService.buildBasicSearchFilterBy(filterBy.filter, ['content']),
  }
  // return dbService.query(COLLECTION_NAME, criteria, filterBy.sort, filterBy.pagination);
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
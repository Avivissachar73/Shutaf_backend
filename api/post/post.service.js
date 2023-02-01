const dbService = require('../../services/db.service');
const { validateType } = require('../../services/interface.service');
const commentService = require('../comment/comment.service');
const postScheme = require('./post.interface').postInterface;

const COLLECTION_NAME = 'post';

async function add(post) {
  validateType(postScheme, post, true);
  return dbService.add(COLLECTION_NAME, post);
}
async function update(post) {
  validateType(postScheme, post, true);
  return dbService.update(COLLECTION_NAME, post);
}
async function remove(postId) {
  return dbService.remove(COLLECTION_NAME, postId);
}
async function get(postId) {
  const post = await dbService.get(COLLECTION_NAME, postId);
  // post.comments = await commentService.query({ filter: { params: { attachedId: postId } } });
  post.comments = await commentService.query({ filter: { params: { attachedId: 'postId' } } });
  return post;
}
async function query(filterBy, organizationId) {
  const criteria = {
    ...dbService.buildBasicSearchFilterBy(filterBy.filter, ['content']),
    organizationId
  }
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
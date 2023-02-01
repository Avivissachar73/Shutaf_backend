const dbService = require('../../services/db.service');
const { validateType } = require('../../services/interface.service');
const shoppingListScheme = require('./shoppingList.interface').shopingListInterface;

const COLLECTION_NAME = 'shopping_list';

async function add(shoppingList) {
  validateType(shoppingListScheme, shoppingList, true);
  return dbService.add(COLLECTION_NAME, shoppingList);
}
async function update(shoppingList) {
  validateType(shoppingListScheme, shoppingList, true);
  return dbService.update(COLLECTION_NAME, shoppingList);
}
async function remove(shopingListId) {
  return dbService.remove(COLLECTION_NAME, shopingListId);
}
async function get(shopingListId) {
  return await dbService.get(COLLECTION_NAME, shopingListId);
}
async function query(filterBy, organizationId) {
  const criteria = {
    ...dbService.buildBasicSearchFilterBy(filterBy.filter, ['title']),
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
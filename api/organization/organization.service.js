const { ObjectId } = require('mongodb');
const dbService = require('../../services/db.service');
const { validateType } = require('../../services/interface.service');
const { organization: organizationScheme } = require('./organization.interface');

const COLLECTION_NAME = 'organization';

async function add(organization) {
  validateType(organizationScheme, organization, true);
  return dbService.add(COLLECTION_NAME, organization);
}
async function update(organization) {
  validateType(organizationScheme, organization, true);
  return dbService.update(COLLECTION_NAME, organization);
}
async function remove(orgId) {
  return dbService.remove(COLLECTION_NAME, orgId);
}
async function get(orgId) {
  const organization = await dbService.get(COLLECTION_NAME, orgId);
  delete organization.password;
  return organization;
}
async function query(filterBy = {}, orgIds = []) {
  const criteria = {
    $and: [
      dbService.buildBasicSearchFilterBy(filterBy.filter, ['name', 'desc']),
      { $or: orgIds.length? orgIds.map(c => ({ _id: ObjectId(c) })) : [{_id: 'EMPTY'}] }
    ]
  };
  // const idsOr = { $or: orgIds.map(c => ({ _id: ObjectId(c._id) })) };
  // if (idsOr.length) criteria.$and.push(idsOr);
  const accountsRes = await dbService.query(COLLECTION_NAME, criteria, filterBy.sort, filterBy.pagination);
  accountsRes.items.forEach(c => delete c.password);
  return accountsRes;
}

module.exports = {
  col: COLLECTION_NAME,
  add,
  update,
  remove,
  query,
  get
}
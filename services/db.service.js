const { MongoClient, ObjectId } = require('mongodb');

const config = require('../config');
const DB_NAME = config.db.name;
const DB_URL = config.db.url;

const CREATED_KEY = '_createdAt';
const UPDATED_KEY = '_updatedAt';

module.exports = {
    connectToDb,
    getCollection,
    connect,
    disConnect,
    ObjectId,
    query,
    get,
    remove,
    save,
    insert,
    add,
    update,
    updateMany,
    buildBasicSearchFilterBy
}



var dbConn = null;
var client = null;

/**
 * @returns {Object} MongoBd connection
 */
async function connect() {
    if (dbConn) return dbConn;
    dbConn = connectToDb(DB_URL, DB_NAME);
    dbConn.catch(err => dbConn = null);
    return dbConn;
}

/**
 * This function creates a connection to the db;
 * if connection is already exists - returns the old connection from cash;
 * @param {String} dbUrl 
 * @param {String} dbName 
 * @returns 
 */
async function connectToDb(dbUrl = DB_URL, dbName = DB_NAME) {
    try {
        // const url = process.env.nodeEnv === 'test'? dbUrl : `${dbUrl}/${dbName}`;
        const url = process.env.NODE_ENV === 'test'? dbUrl : `${dbUrl}/${dbName}`;
        client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        return db;
    } catch (err) {
        throw err;
    }
}

// This function disconnect the db;
async function disConnect() {
    if (!client) return;
    await client.close();
    client = dbConn = null;
}


/**
 * @param {String} collectionName the name of the required collection from the db;
 * @returns {Object} mongoDb collection object
 */
async function getCollection(collectionName) {
    const db = await connect()
    return db.collection(collectionName);
}



async function query(collectionName, criteria = {}, sortBy = {}, pagination = { limit: 0, page: 0 }) {
    const collection = await getCollection(collectionName);
    
    let itemsPrm = collection.find(criteria).sort({...sortBy, $natural: -1});
    const total = await itemsPrm.count()
    if (pagination.page && pagination.limit) itemsPrm = itemsPrm.skip(pagination.page * pagination.limit);
    if (pagination.limit) itemsPrm = itemsPrm.limit(pagination.limit);
    const items = await itemsPrm.toArray();
    
    return { items, total };
}

async function get(collectionName, id) {
    const collection = await getCollection(collectionName)
    const item = await collection.findOne({ "_id": ObjectId(id) });
    return item;
}

async function save(collectionName, item) {
    if (item._id) return add(collectionName, item);
    return update(collectionName ,item);
  }
  
async function add(collectionName, item) {
  item[CREATED_KEY] = Date.now();
  const collection = await getCollection(collectionName);
  await collection.insertOne(item);
  return item;
}

async function update(collectionName, item) {
  item[UPDATED_KEY] = Date.now();
  const collection = await getCollection(collectionName);
  item._id = ObjectId(item._id);
  await collection.updateOne({"_id": item._id}, {$set : item});
  return item;
}

async function updateMany(collectionName, items) {
  return Promise.all(items.map(item => update(collectionName, item)));
}

async function remove(collectionName, id) {
    const collection = await getCollection(collectionName);
    await collection.deleteOne({ "_id": ObjectId(id) });
    return id;
}

async function insert(collectionName, items) {
    items.forEach(item => item[CREATED_KEY] = Date.now());
    const collection = await getCollection(collectionName);
    await collection.insertMany(items);
    return items;
}


function buildBasicSearchFilterBy(filterBy = { search: '', params: {} }, searchOnFields = []) {
    // const $or = [];
    // for (let field of searchOnFields) $or.push({[field]: {$regex: RegExp(filterBy?.search || '', 'i')}})
    // return { $or, ...(filterBy?.params || {}) };
    return { 
        $or: searchOnFields.map(field => ({[field]: {$regex: RegExp(filterBy?.search || '', 'i')}})),
        ...(filterBy?.params || {})
    };
}
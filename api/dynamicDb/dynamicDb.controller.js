const { fixDeepQuery } = require('../../services/utils.service');
const dynamicDbService = require('./dynamicDb.service');
const _errMsg = require('../../services/utils.service').getCreateErrMsg('example.controller');


async function add(req, res, next) {
  try {
    const addedItem = await dynamicDbService.add(req.params.collectionName, req.body);
    res.send(addedItem);
  } catch(err) {
    next({msg: _errMsg(`Couldn't add item`, 'add', err)});
  }
}

async function update(req, res, next) {
  try {
    const updatedItem = await dynamicDbService.update(req.params.collectionName, req.body);
    res.send(updatedItem);
  } catch(err) {
    next({msg: _errMsg(`Couldn't update item`, 'update', err)});
  }
}

async function remove(req, res, next) {
  try {
    const id = req.params.id;
    await dynamicDbService.remove(req.params.collectionName, id);
    res.send({msg: `removed item with id: ${id}`});
  } catch(err) {
    next({msg: _errMsg(`Couldn't remove item`, 'remove', err)});
  }
}

async function get(req, res, next) {
  try {
    const id = req.params.id;
    const item = await dynamicDbService.get(req.params.collectionName, id);
    res.send(item);
  } catch(err) {
    next({msg: _errMsg(`Couldn't get item`, 'get', err)});
  }
}

async function query(req, res, next) {
  try {
    const items = await dynamicDbService.query(req.params.collectionName, fixDeepQuery(req.query));
    res.send(items);
  } catch(err) {
    next({msg: _errMsg(`Couldn't query items`, 'query', err)});
  }
}

module.exports = {
  add,
  update,
  remove,
  query,
  get,
}
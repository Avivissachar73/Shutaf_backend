const { validateCreatorOrAdmin } = require('../../services/userValidation.service');
const { fixDeepQuery, createError } = require('../../services/utils.service');
const { getUserFromExpressReq } = require('../auth/auth.controller.js');
const exampleService = require('./example.service');
const _errMsg = require('../../services/utils.service').getCreateErrMsg('example.controller');


async function add(req, res, next) {
  try {
    const addedItem = await exampleService.add(req.body);
    res.send(addedItem);
  } catch(err) {
    next({msg: _errMsg(`Couldn't add item`, 'add', err)});
  }
}

async function update(req, res, next) {
  try {
    const updatedItem = await exampleService.update(req.body);
    res.send(updatedItem);
  } catch(err) {
    next({msg: _errMsg(`Couldn't update item`, 'update', err)});
  }
}

async function remove(req, res, next) {
  try {
    const id = req.params.id;

    const item = exampleService.get(id);
    if (!validateCreatorOrAdmin(item, getUserFromExpressReq(req))) return res.status(401).send(createError('Unauthorized', 401));

    await exampleService.remove(id);
    res.send({msg: `removed item with id: ${id}`});
  } catch(err) {
    next({msg: _errMsg(`Couldn't remove item`, 'remove', err)});
  }
}

async function get(req, res, next) {
  try {
    const id = req.params.id;
    const item = await exampleService.get(id);
    res.send(item);
  } catch(err) {
    next({msg: _errMsg(`Couldn't get item`, 'get', err)});
  }
}

async function query(req, res, next) {
  try {
    const items = await exampleService.query(fixDeepQuery(req.query));
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
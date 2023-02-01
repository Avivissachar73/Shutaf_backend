const { fixDeepQuery } = require('../../services/utils.service');
const shoppingListService = require('./shoppingList.service');
const _errMsg = require('../../services/utils.service').getCreateErrMsg('shoppingList.controller');
const socketService = require('../../services/socket.service');


async function add(req, res, next) {
  try {
    const shoppingListAdd = req.body;
    shoppingListAdd.organizationId = req.params.organizationId;
    const addedPost = await shoppingListService.add(shoppingListAdd);
    res.send(addedPost);
  } catch(err) {
    next({msg: _errMsg(`Couldn't add shoppingList`, 'add', err)});
  }
}

async function update(req, res, next) {
  try {
    delete req.body.comments;
    const updatedShoppingList = await shoppingListService.update(req.body);
    socketService.getIO().emit(`update-shoppingList-${updatedShoppingList._id}`, {shoppingList: updatedShoppingList});
    res.send(updatedShoppingList);
  } catch(err) {
    next({msg: _errMsg(`Couldn't update shoppingList`, 'update', err)});
  }
}

async function remove(req, res, next) {
  try {
    const id = req.params.id;
    await shoppingListService.remove(id);
    res.send({msg: `removed shoppingList with id: ${id}`});
  } catch(err) {
    next({msg: _errMsg(`Couldn't remove shoppingList`, 'remove', err)});
  }
}

async function get(req, res, next) {
  try {
    const id = req.params.id;
    const shoppingList = await shoppingListService.get(id);
    res.send(shoppingList);
  } catch(err) {
    next({msg: _errMsg(`Couldn't get shoppingList`, 'get', err)});
  }
}

async function query(req, res, next) {
  try {
    const { organizationId } = req.params;
    const shoppingLists = await shoppingListService.query(fixDeepQuery(req.query), organizationId);
    res.send(shoppingLists);
  } catch(err) {
    next({msg: _errMsg(`Couldn't query shoppingLists`, 'query', err)});
  }
}

module.exports = {
  add,
  update,
  remove,
  query,
  get,
}
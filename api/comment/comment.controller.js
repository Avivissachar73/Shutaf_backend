const { validateCreatorOrAdmin, validateCreatorOrOrgAdmin } = require('../../services/userValidation.service');
const { fixDeepQuery, createError } = require('../../services/utils.service');
const { getUserFromExpressReq } = require('../auth/auth.controller.js');
const commentService = require('./comment.service');
const _errMsg = require('../../services/utils.service').getCreateErrMsg('comment.controller');

const socketService = require('../../services/socket.service');

async function add(req, res, next) {
  try {
    const commentToAdd = req.body;
    // commentToAdd.organizationId = req.params.organizationId;
    const addedComment = await commentService.add(commentToAdd);
    socketService.getIO().emit(`add-comment-for-item-${addedComment.attachedId}`, {comment: addedComment});
    res.send(addedComment);
  } catch(err) {
    next({msg: _errMsg(`Couldn't add comment`, 'add', err)});
  }
}

async function update(req, res, next) {
  try {
    const id = req.body._id;
    
    const comment = await commentService.get(id);
    if (!validateCreatorOrAdmin(comment, getUserFromExpressReq(req))) return res.status(401).send(createError('Unauthorized, cant edit comment', 401));

    const updatedComment = await commentService.update(req.body);
    socketService.getIO().emit(`add-comment-for-item-${id}`, {comment: updatedComment});
    res.send(updatedComment);
  } catch(err) {
    next({msg: _errMsg(`Couldn't update comment`, 'update', err)});
  }
}

async function remove(req, res, next) {
  try {
    const id = req.params.id;
    const comment = await commentService.get(id);
    if (!validateCreatorOrAdmin(comment, getUserFromExpressReq(req))) return res.status(401).send(createError('Unauthorized, cant remove comment', 401));

    socketService.getIO().emit(`remove-comment-for-item-${comment.attachedId}`, {id: comment._id});

    await commentService.remove(id);
    res.send({msg: `removed comment with id: ${id}`});
  } catch(err) {
    next({msg: _errMsg(`Couldn't remove comment`, 'remove', err)});
  }
}

async function get(req, res, next) {
  try {
    const id = req.params.id;
    const comment = await commentService.get(id);
    res.send(comment);
  } catch(err) {
    next({msg: _errMsg(`Couldn't get comment`, 'get', err)});
  }
}

async function query(req, res, next) {
  try {
    const { organizationId } = req.params;
    const comments = await commentService.query(fixDeepQuery(req.query), organizationId);
    res.send(comments);
  } catch(err) {
    next({msg: _errMsg(`Couldn't query comments`, 'query', err)});
  }
}

module.exports = {
  add,
  update,
  remove,
  query,
  get,
}
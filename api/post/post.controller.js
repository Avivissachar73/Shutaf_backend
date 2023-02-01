const { validateCreatorOrAdmin, validateCreatorOrOrgAdmin } = require('../../services/userValidation.service');
const { fixDeepQuery, createError } = require('../../services/utils.service');
const { getUserFromExpressReq } = require('../auth/auth.controller.js');
const postService = require('./post.service');
const _errMsg = require('../../services/utils.service').getCreateErrMsg('post.controller');


async function add(req, res, next) {
  try {
    const postToAdd = req.body;
    postToAdd.organizationId = req.params.organizationId;
    const addedPost = await postService.add(postToAdd);
    res.send(addedPost);
  } catch(err) {
    next({msg: _errMsg(`Couldn't add post`, 'add', err)});
  }
}

async function update(req, res, next) {
  try {
    const id = req.body._id;
    
    const post = await postService.get(id);
    if (!validateCreatorOrOrgAdmin(post, getUserFromExpressReq(req))) return res.status(401).send(createError('Unauthorized, cant edit post', 401));
    
    delete req.body.comments;
    const updatedPost = await postService.update(req.body);
    res.send(updatedPost);
  } catch(err) {
    next({msg: _errMsg(`Couldn't update post`, 'update', err)});
  }
}

async function remove(req, res, next) {
  try {
    const id = req.params.id;

    const post = await postService.get(id);
    if (!validateCreatorOrOrgAdmin(post, getUserFromExpressReq(req))) return res.status(401).send(createError('Unauthorized, cant remove post', 401));

    await postService.remove(id);
    res.send({msg: `removed post with id: ${id}`});
  } catch(err) {
    next({msg: _errMsg(`Couldn't remove post`, 'remove', err)});
  }
}

async function get(req, res, next) {
  try {
    const id = req.params.id;
    const post = await postService.get(id);
    res.send(post);
  } catch(err) {
    next({msg: _errMsg(`Couldn't get post`, 'get', err)});
  }
}

async function query(req, res, next) {
  try {
    const { organizationId } = req.params;
    const posts = await postService.query(fixDeepQuery(req.query), organizationId);
    res.send(posts);
  } catch(err) {
    next({msg: _errMsg(`Couldn't query posts`, 'query', err)});
  }
}

module.exports = {
  add,
  update,
  remove,
  query,
  get,
}
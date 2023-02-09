const { fixDeepQuery } = require('../../services/utils.service');
const bugService = require('./bug.service');
const _errMsg = require('../../services/utils.service').getCreateErrMsg('bug.controller');

async function add(req, res, next) {
  try {
    req.body.status = 'pending';
    const addedBug = await bugService.add(req.body);
    res.send(addedBug);
  } catch(err) {
    next({msg: _errMsg(`Couldn't add bug`, 'add', err)});
  }
}

async function update(req, res, next) {
  try {
    const updatedBug = await bugService.update(req.body);
    res.send(updatedBug);
  } catch(err) {
    next({msg: _errMsg(`Couldn't update bug`, 'update', err)});
  }
}

async function remove(req, res, next) {
  try {
    const id = req.params.id;
    await bugService.remove(id);
    res.send({msg: `removed bug with id: ${id}`});
  } catch(err) {
    next({msg: _errMsg(`Couldn't remove bug`, 'remove', err)});
  }
}

async function get(req, res, next) {
  try {
    const id = req.params.id;
    const bug = await bugService.get(id);
    res.send(bug);
  } catch(err) {
    next({msg: _errMsg(`Couldn't get bug`, 'get', err)});
  }
}

async function query(req, res, next) {
  try {
    const bugs = await bugService.query(fixDeepQuery(req.query));
    res.send(bugs);
  } catch(err) {
    next({msg: _errMsg(`Couldn't query bugs`, 'query', err)});
  }
}


module.exports = {
  query,
  get,
  remove,
  update,
  add
}
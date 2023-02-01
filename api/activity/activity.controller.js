const { fixDeepQuery } = require('../../services/utils.service');
const activityService = require('./activity.service');

const _errMsg = require('../../services/utils.service').getCreateErrMsg('activity.controller');


async function add(req, res, next) {
  try {
    const addedActivity = await activityService.add(req.body);
    res.send(addedActivity);
  } catch(err) {
    next({msg: _errMsg(`Couldn't add activity`, 'add', err)});
  }
}

async function update(req, res, next) {
  try {
    const updatedActivity = await activityService.update(req.body);
    res.send(updatedActivity);
  } catch(err) {
    next({msg: _errMsg(`Couldn't update activity`, 'update', err)});
  }
}

async function remove(req, res, next) {
  try {
    const id = req.params.id;
    await activityService.remove(id);
    res.send({msg: `removed activity with id: ${id}`});
  } catch(err) {
    next({msg: _errMsg(`Couldn't remove activity`, 'remove', err)});
  }
}

async function get(req, res, next) {
  try {
    const id = req.params.id;
    const activity = await activityService.get(id);
    res.send(activity);
  } catch(err) {
    next({msg: _errMsg(`Couldn't get activity`, 'get', err)});
  }
}

async function query(req, res, next) {
  try {
    const activities = await activityService.query(fixDeepQuery(req.query));
    res.send(activities);
  } catch(err) {
    next({msg: _errMsg(`Couldn't query activities`, 'query', err)});
  }
}


module.exports = {
  add,
  update,
  remove,
  query,
  get,
}
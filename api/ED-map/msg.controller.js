const msgService = require('./msg.service');
const _errMsg = require('../../services/utils.service').getCreateErrMsg('msg.controller');

async function getMsgs(req, res, next) {
  try {
    const msgs = await msgService.getMsgs();
    res.send(msgs);
  } catch(err) {
    next({msg: _errMsg(`Couldn't get msgsMap`, 'getMsgs', err)});
  }
}

async function updateMsgs(req, res, next) {
  try {
    const updatedSettings = await msgService.updateMsgs(req.body);
    res.send(updatedSettings);
  } catch(err) {
    next({msg: _errMsg(`Couldn't update msgsMap`, 'updateMsgs', err)});
  }
}

module.exports = {
  getMsgs,
  updateMsgs
}
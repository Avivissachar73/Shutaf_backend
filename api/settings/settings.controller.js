const settingsService = require('./settings.service');
const _errMsg = require('../../services/utils.service').getCreateErrMsg('settings.controller');

async function getSettings(req, res, next) {
  try {
    const settings = await settingsService.getSettings();
    res.send(settings);
  } catch(err) {
    next({msg: _errMsg(`Couldn't get config data`, 'getSettings', err)});
  }
}


async function updateSettings(req, res, next) {
  try {
    const updatedSettings = await settingsService.updateSettings(req.body);
    res.send(updatedSettings);
  } catch(err) {
    next({msg: _errMsg(`Couldn't update settings`, 'updateSettings', err)});
  }
}

async function getConfig(req, res, next) {
  try {
    const conf = await settingsService.getConfig();
    res.send(conf);
  } catch(err) {
    next({msg: _errMsg(`Couldn't get config data`, 'getConfig', err)});
  }
}

module.exports = {
  getSettings,
  getConfig,
  updateSettings
}
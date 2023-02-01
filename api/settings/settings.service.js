const dbService = require('../../services/db.service');
const config = require('../../config');
const { userRoles } = require('../../services/const.service');
const { validateType, generateItemFromInterface } = require('../../services/interface.service');
const { settings: settingsScheme } = require('./settings.interface');

const COLLECTION_NAME = 'settings';

async function getConfig(filterBy) {
  return {
    env: config.env,
    userRoles
  };
}
async function getSettings(filterBy) {
  const settingsRes = await dbService.query(COLLECTION_NAME);
  if (!settingsRes?.items?.length) return dbService.add(COLLECTION_NAME, generateItemFromInterface(settingsScheme, false));
  return settingsRes.items[0];
}

async function updateSettings(settings) {
  validateType(settingsScheme, settings, true);
  return dbService.update(COLLECTION_NAME, settings);
}

module.exports = {
  col: COLLECTION_NAME,
  getConfig,
  getSettings,
  updateSettings
}
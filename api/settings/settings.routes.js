const express = require('express');
const settingsController = require('./settings.controller');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { validateAdmin } = require('../../middlewares/validateUserRole.middleware');

const connectSettingsRoutes = (server, rootBaseUrl) => {
  const router = express.Router()
  const baseUrl = `${rootBaseUrl}/settings`;
  router.get('/', settingsController.getSettings);
  router.put('/', requireAuth, validateAdmin, settingsController.updateSettings);
  router.get('/config', settingsController.getConfig);
  server.use(baseUrl, router);
  return server;
}

module.exports = { connectSettingsRoutes };
const express = require('express');
const msgController = require('./msg.controller');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { validateAdmin } = require('../../middlewares/validateUserRole.middleware');

const connectEdAppRoutes = (server, rootBaseUrl) => {
  const router = express.Router()
  const baseUrl = `${rootBaseUrl}/ed-app/msg`;
  router.get('/', requireAuth, validateAdmin, msgController.getMsgs);
  router.put('/', requireAuth, validateAdmin, msgController.updateMsgs);
  server.use(baseUrl, router);
  return server;
}

module.exports = { connectEdAppRoutes };
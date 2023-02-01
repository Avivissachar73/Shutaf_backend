const express = require('express');
const activityController = require('./activity.controller');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');

const connectActivityRoutes = (server, rootBaseUrl) => {
  const router = express.Router();
  const baseUrl = `${rootBaseUrl}/activity`;
  router.use(requireAuth);
  router.get('/', activityController.query);
  router.get('/:id', activityController.get);
  router.post('/', activityController.add);
  // router.put('/', activityController.update);
  router.delete('/:id', activityController.remove);
  server.use(baseUrl, router);

  return router;
}

module.exports = { connectActivityRoutes };
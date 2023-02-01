const express = require('express');
const dynamicDbController = require('./dynamicDb.controller');
// const { requireAuth } = require('../../middlewares/requireAuth.middleware');
// const { validateAdmin } = require('../../middlewares/validateUserRole.middleware');

const connectDynamicDbRoutes = (server, rootBaseUrl) => {
  const router = express.Router({mergeParams: true});
  const baseUrl = `${rootBaseUrl}/dynamic-db/:collectionName`;
  // router.use(requireAuth);
  router.get('/', dynamicDbController.query);
  router.get('/:id', dynamicDbController.get);
  router.post('/', dynamicDbController.add);
  router.put('/', dynamicDbController.update);
  router.delete('/:id', dynamicDbController.remove);
  server.use(baseUrl, router);

  return router;
}

module.exports = { connectDynamicDbRoutes };
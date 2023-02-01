const express = require('express');
const exampleController = require('./example.controller');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { validateAdmin } = require('../../middlewares/validateUserRole.middleware');
const { addCreatedByToReqBody } = require('../../middlewares/addCreatedByToReqBody.middleware');

const connectExampleRoutes = (server, rootBaseUrl) => {
  const router = express.Router();
  const baseUrl = `${rootBaseUrl}/example`;
  router.use(requireAuth);
  router.get('/', exampleController.query);
  router.get('/:id', exampleController.get);
  router.post('/', addCreatedByToReqBody, exampleController.add);
  router.put('/', exampleController.update);
  router.delete('/:id', exampleController.remove);
  server.use(baseUrl, router);

  return router;
}

module.exports = { connectExampleRoutes };
const express = require('express');
const bugController = require('./bug.controller');
const { validateAdmin } = require('../../middlewares/validateUserRole.middleware');
const { addCreatedByToReqBody } = require('../../middlewares/addCreatedByToReqBody.middleware');

const connectBugRoutes = (server, rootBaseUrl) => {
  const bugRouter = express.Router();
  const accountBaseUrl = `${rootBaseUrl}/bug`;
  bugRouter.get('/', validateAdmin, bugController.query);
  bugRouter.get('/:id', validateAdmin, bugController.get);
  bugRouter.post('/', addCreatedByToReqBody, bugController.add);
  bugRouter.put('/', validateAdmin, bugController.update);
  bugRouter.delete('/:id', validateAdmin, bugController.remove);
  server.use(accountBaseUrl, bugRouter);

  return bugRouter;
}

module.exports = { connectBugRoutes };
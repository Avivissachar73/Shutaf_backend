const express = require('express');
const accountController = require('./account.controller');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { validateAdmin, validateSelfOrAdmin } = require('../../middlewares/validateUserRole.middleware');

const connectAccountRoutes = (server, rootBaseUrl) => {
  const accountRouter = express.Router();
  const accountBaseUrl = `${rootBaseUrl}/account`;
  accountRouter.use(requireAuth);
  accountRouter.get('/', accountController.query);
  accountRouter.get('/:id', accountController.get);
  accountRouter.post('/', validateAdmin, accountController.add);
  accountRouter.put('/', validateSelfOrAdmin, accountController.update);
  accountRouter.delete('/:id', validateSelfOrAdmin, accountController.remove);
  server.use(accountBaseUrl, accountRouter);

  return accountRouter;
}

module.exports = { connectAccountRoutes };
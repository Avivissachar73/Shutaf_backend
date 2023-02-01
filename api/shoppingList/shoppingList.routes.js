const express = require('express');
const postController = require('./shoppingList.controller');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { addCreatedByToReqBody } = require('../../middlewares/addCreatedByToReqBody.middleware');
const { validateOrganizationMember } = require('../../middlewares/validateUserOrganization.middleware');

const connectShoppingListRoutes = (server, rootBaseUrl) => {
  const router = express.Router({ mergeParams: true });
  const baseUrl = `${rootBaseUrl}/shopping-list/:organizationId`;
  router.use(requireAuth);
  router.use(validateOrganizationMember);

  router.get('/', postController.query);
  router.get('/:id', postController.get);
  router.post('', addCreatedByToReqBody, postController.add);
  router.put('', postController.update);
  router.delete('/:id', postController.remove);
  server.use(baseUrl, router);

  return router;
}

module.exports = { connectShoppingListRoutes };
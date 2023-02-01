const express = require('express');
const postController = require('./post.controller');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { validateAdmin } = require('../../middlewares/validateUserRole.middleware');
const { addCreatedByToReqBody } = require('../../middlewares/addCreatedByToReqBody.middleware');
const { validateOrganizationMember, validateCreatorOrOrgAdmin } = require('../../middlewares/validateUserOrganization.middleware');
const { validateCreatorOrAdmin } = require('../../services/userValidation.service');

const connectPostRoutes = (server, rootBaseUrl) => {
  const router = express.Router({ mergeParams: true });
  const baseUrl = `${rootBaseUrl}/post/:organizationId`;
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

module.exports = { connectPostRoutes };
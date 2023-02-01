const express = require('express');
const commentController = require('./comment.controller');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { addCreatedByToReqBody } = require('../../middlewares/addCreatedByToReqBody.middleware');
const { validateOrganizationMember } = require('../../middlewares/validateUserOrganization.middleware');

const connectCommentRoutes = (server, rootBaseUrl) => {
  const router = express.Router({ mergeParams: true });
  // const baseUrl = `${rootBaseUrl}/comment/:organizationId`;
  const baseUrl = `${rootBaseUrl}/comment`;
  router.use(requireAuth);
  // router.use(validateOrganizationMember);

  router.get('/', commentController.query);
  router.get('/:id', commentController.get);
  router.post('', addCreatedByToReqBody, commentController.add);
  router.put('', commentController.update);
  router.delete('/:id', commentController.remove);
  server.use(baseUrl, router);

  return router;
}

module.exports = { connectCommentRoutes };
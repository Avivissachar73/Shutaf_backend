const express = require('express');
const organizationController = require('./organization.controller');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { validateAdmin, validateSelfOrAdmin } = require('../../middlewares/validateUserRole.middleware');
const { addCreatedByToReqBody } = require('../../middlewares/addCreatedByToReqBody.middleware');
const { validateCreatorOrAdmin } = require('../../services/userValidation.service');
const { validateOrganization, validateOrganizationMember } = require('../../middlewares/validateUserOrganization.middleware');

const connectOrganizationRoutes = (server, rootBaseUrl) => {
  const router = express.Router();
  const accountBaseUrl = `${rootBaseUrl}/organization`;
  router.use(requireAuth);
  router.get('/', organizationController.query);
  router.get('/:id', validateOrganization, validateOrganizationMember, organizationController.get);
  router.post('/', addCreatedByToReqBody, organizationController.add);
  router.put('/', validateOrganization, organizationController.update);
  router.delete('/:id', validateOrganization, organizationController.remove);

  router.post('/:organizationId/invite/:accountId', validateOrganization, organizationController.inviteAccount);
  router.post('/:organizationId/update-status/:accountId', validateOrganization, organizationController.changeAccountStatusOnOrg);

  server.use(accountBaseUrl, router);

  return router;
}

module.exports = { connectOrganizationRoutes };
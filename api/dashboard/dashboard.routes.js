const express = require('express');
const dashboardController = require('./dashboard.controller');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { validateOrganization } = require('../../middlewares/validateUserOrganization.middleware');

const connectDashboardRoutes = (server, rootBaseUrl) => {
  const router = express.Router();
  const accountBaseUrl = `${rootBaseUrl}/dashboard`;
  router.use(requireAuth);
  
  router.get('/organization/:organizationId/stats', validateOrganization, dashboardController.getOrganizationStats);

  server.use(accountBaseUrl, router);

  return router;
}

module.exports = { connectDashboardRoutes };
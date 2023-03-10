const { connectAccountRoutes } = require('../api/account/account.routes');
const { connectAuthRoutes } = require('../api/auth/auth.routes');
const { connectActivityRoutes } = require('../api/activity/activity.routes');
const { connectSettingsRoutes } = require('../api/settings/settings.routes');
const { connectOrganizationRoutes } = require('../api/organization/organization.routes');
const { connectPostRoutes } = require('../api/post/post.routes');
const { connectCommentRoutes } = require('../api/comment/comment.routes');
const { connectBugRoutes } = require('../api/bug/bug.routes');
const { connectDashboardRoutes } = require('../api/dashboard/dashboard.routes');

const { connectShoppingListRoutes } = require('../api/shoppingList/shoppingList.routes');

module.exports = (server) => {
  const baseUrl = '/api';

  [
    connectAccountRoutes,
    connectAuthRoutes,
    connectActivityRoutes,
    connectSettingsRoutes,
    connectOrganizationRoutes,
    connectPostRoutes,
    connectCommentRoutes,
    connectBugRoutes,
    connectDashboardRoutes,
    
    connectShoppingListRoutes
  ]
  .forEach(service => service(server, baseUrl));

  return server;
}
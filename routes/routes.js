const { connectExampleRoutes } = require('../api/example/example.routes');
const { connectAccountRoutes } = require('../api/account/account.routes');
const { connectAuthRoutes } = require('../api/auth/auth.routes');
const { connectActivityRoutes } = require('../api/activity/activity.routes');
const { connectSettingsRoutes } = require('../api/settings/settings.routes');
const { connectDynamicDbRoutes } = require('../api/dynamicDb/dynamicDb.routes');
const { connectOrganizationRoutes } = require('../api/organization/organization.routes');

const { connectPostRoutes } = require('../api/post/post.routes');
const { connectCommentRoutes } = require('../api/comment/comment.routes');

const { connectEdAppRoutes } = require('../api/ED-Map/msg.routes');
const { connectShoppingListRoutes } = require('../api/shoppingList/shoppingList.routes');

module.exports = (server) => {
  const baseUrl = '/api';

  [
    connectExampleRoutes,
    connectAccountRoutes,
    connectAuthRoutes,
    connectActivityRoutes,
    connectSettingsRoutes,
    connectDynamicDbRoutes,
    connectOrganizationRoutes,
    connectPostRoutes,
    connectCommentRoutes,
    
    connectEdAppRoutes,
    connectShoppingListRoutes
  ]
  .forEach(service => service(server, baseUrl));

  return server;
}
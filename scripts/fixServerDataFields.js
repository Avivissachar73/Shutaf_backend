
const dbService = require('../services/db.service');

fixDataServerFieldsNaming();

async function fixDataServerFieldsNaming() {
  const COLLECTIONS = [
    require('../api/activity/activity.service').col,
    require('../api/bug/bug.service').col,
    require('../api/comment/comment.service').col,
    require('../api/organization/organization.service').col,
    require('../api/post/post.service').col,
    require('../api/shoppingList/shoppingList.service').col,
  ];
  const FIX_FIELDS = ['createdAt', 'updatedAt', 'organizationId', 'createdBy'];
  console.log('FIXING DATA FIELDS NAMES')
  const prms = COLLECTIONS.map(async colName => {
    console.log('#o# FIXING COL:', colName);
    const data = await dbService.query(colName);
    const fixedItems = data.items.map(item => {
      FIX_FIELDS.forEach(field => {
        if (item[field]) {
          item['_'+field] = item[field];
          delete item[field];
        }
      });
      if (item._createdBy) item._createdBy = item._createdBy._id || item._createdBy;
      return item;
    });
    const res = await Promise.all(fixedItems.map(async c => {
      await dbService.remove(colName, c._id);
      return dbService.add(colName, c)
    }));
    console.log('#x# DONE FIXING COL:', colName);
    return res;
  });
  await Promise.all(prms);
  await dbService.disConnect();
  console.log('DONE FIXING DATA FIELDS NAMES');
}
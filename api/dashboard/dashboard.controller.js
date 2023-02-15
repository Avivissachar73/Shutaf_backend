const _errMsg = require('../../services/utils.service').getCreateErrMsg('organization.controller');

const activityService = require('../activity/activity.service.js');
const { getTimeStr } = require('./dashboard.service');

async function getOrganizationStats(req, res, next) {
  try {
    const organizationId = req.params.organizationId;
    const relevantActivityRes = await activityService.query({ filter: { params: { attachedId: organizationId }} });
    const activities = relevantActivityRes.items;
    const stats = activities.reduce((acc, c) => {
      const byUser = c.createdBy;
      // const userKey = byUser._id;
      const userKey = byUser.username;
      // const timeKey = `${at.getMonth()}/${at.getDate()}/${at.getFullYear()}`;
      const timeKey = getTimeStr(c._createdAt, 'day');
      if (!['productEaten', 'boughtProduct'].includes(c.name)) return acc;
      if (c.name === 'productEaten') {
        if (!acc.users.eatData[userKey]) acc.users.eatData[userKey] = { total: 0, healthMap: {}, healthAvg: 0, healthSum: 0 };
        c.data.items.forEach(item => {
          acc.users.eatData[userKey].total += item.count;
          acc.users.eatData[userKey].healthMap[item.healthRate] = acc.users.eatData[userKey].healthMap[item.healthRate]+1 || 1;
          acc.users.eatData[userKey].healthSum += item.healthRate || 0;
          acc.users.eatData[userKey].healthAvg = acc.users.eatData[userKey].healthSum / acc.users.eatData[userKey].total;
        
          if (!acc.timeline.eat[timeKey]) acc.timeline.eat[timeKey] = { total: 0, price: 0, healthSum: 0, healthAvg: 0, healthMap: {} }; 
          acc.timeline.eat[timeKey].total += item.count;
          acc.timeline.eat[timeKey].price += item.price * item.count;
          acc.timeline.eat[timeKey].healthSum += item.healthRate || 0;
          acc.timeline.eat[timeKey].healthAvg = acc.timeline.eat[timeKey].healthSum / acc.timeline.eat[timeKey].total;
          acc.timeline.eat[timeKey].healthMap[item.healthRate] = acc.timeline.eat[timeKey].healthMap[item.healthRate]+1 || 1;
        });
      }
      else if (c.name === 'boughtProduct') {
        if (!acc.users.buyData[userKey]) acc.users.buyData[userKey] = { total: 0, price: 0 };
        c.data.items.forEach(item => {
          acc.users.buyData[userKey].total += item.count;
          acc.users.buyData[userKey].price += item.count*item.price;

          if (!acc.timeline.buy[timeKey]) acc.timeline.buy[timeKey] = { total: 0, price: 0, healthSum: 0, healthAvg: 0, healthMap: {} }; 
          acc.timeline.buy[timeKey].total += item.count;
          acc.timeline.buy[timeKey].price += item.price * item.count;
          acc.timeline.buy[timeKey].healthSum += item.healthRate || 0;
          acc.timeline.buy[timeKey].healthAvg = acc.timeline.buy[timeKey].healthSum / acc.timeline.buy[timeKey].total;
          acc.timeline.buy[timeKey].healthMap[item.healthRate] = acc.timeline.buy[timeKey].healthMap[item.healthRate]+1 || 1;
        });
      }
      
      return acc;
    }, { users: { eatData: {}, buyData: {} }, timeline: { eat: {}, buy: {} } });
    const result = {
      organizationId,
      // activities: relevantActivityRes,
      stats
    }
    res.send(result);
  } catch(err) {
    next({msg: _errMsg(`Couldn't get organization stats`, 'getOrganizationStats', err)});
  }
}

module.exports = {
  getOrganizationStats
}

const dbService = require('../../services/db.service');

const COLLECTION_NAME = 'map_msgs_map';

async function getMsgs() {
  const msgMapRes = await dbService.query(COLLECTION_NAME);
  if (!msgMapRes?.items?.length) return dbService.insert(COLLECTION_NAME, require('./msgs.json'));
  return msgMapRes.items;
}
// async function getMsgs() {
//   return require('./msgsMap.json');
// }

// async function updateMsg(msgs) {
//   return dbService.update(COLLECTION_NAME, msgsMap);
// }

async function updateMsgs(msgs) {
  return dbService.updateMany(COLLECTION_NAME, msgs);
}

var _msgMap = null;
async function getMsgsMap() {
  if (_msgMap) return _msgMap;
  const msgs = await getMsgs();
  const msgsMap = msgs.reduce((acc, c) => ({...acc, [c.name]: c}), {});
  _msgMap = msgsMap;
  return msgsMap;
}



function parseMsgsMapForUi(map) {
  const res = {};
  for (let key in map) res[key] = map[key].ui;
  return res;
}

module.exports = {
  col: COLLECTION_NAME,
  getMsgs,
  updateMsgs,
  parseMsgsMapForUi,
  getMsgsMap
}



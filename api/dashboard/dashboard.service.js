
function mapItems(items, mapKey = '', cb = null, initailValue = {}) {
  initailValue = deepClone(initailValue)
  if (!items || !items.length) {
    const res = {}
    for (let key in initailValue) res[key] = cb(initailValue[key], key, initailValue);
    return res
  }
  return items.reduce((map, item, idx) => {
    const itemMapKey = item[mapKey];
    if (!map[itemMapKey]) map[itemMapKey] = [];
    map[itemMapKey].push(item);
    if (cb && idx === items.length - 1) for (let key in map) map[key] = cb(map[key], key, map);
    return map;
  }, initailValue);
}

// TODO: change parameters to be an object
function mapByTimeGroup(items, timeGroup = 'day', cb = null, initailValue = {}, timeKey = 'time') {
  initailValue = deepClone(initailValue)
  if (!items || !items.length) {
    const res = {}
    for (let key in initailValue) res[key] = cb(initailValue[key], key, initailValue);
    return res
  }
  return items.reduce((map, item, idx) => {
    const dayStr = getTimeStr(item[timeKey], timeGroup);
    if (!map[dayStr]) map[dayStr] = [];
    map[dayStr].push(item);
    if (cb && idx === items.length - 1) {
      for (let key in map) map[key] = cb(map[key], key, map);
    };
    return map;
  }, initailValue);
}

var getTimeStr = (() => {
  const timeGroupsMap = {
    year: 0,
    month: 1,
    week: 2,
    day: 3,
    houre: 4,
    minute: 5,
    second: 6,
    mil: 7
  }
  
  return (time = new Date(), group = 'day') => {
    time = new Date(time);
    const timeMap = { y:0,m:0,w:0,d:0,h:0,min:0,s:0,mil:0 };
    timeMap.y = time.getFullYear();
    // if (timeGroupsMap[group] >= 2) timeMap.w = _getWeek(time);
    if (timeGroupsMap[group] >= 1) timeMap.m = time.getMonth();
    if (timeGroupsMap[group] >= 2) timeMap.d = _getWeek(time)*7;
    if (timeGroupsMap[group] >= 3) timeMap.d = time.getDate();
    if (timeGroupsMap[group] >= 4) timeMap.h = time.getHours();
    if (timeGroupsMap[group] >= 5) timeMap.min = time.getMinutes();
    if (timeGroupsMap[group] >= 6) timeMap.s = time.getSeconds();
    if (timeGroupsMap[group] >= 7) timeMap.mil = time.getMilliseconds();
    const res = new Date(timeMap.y, timeMap.m, timeMap.d, timeMap.h, timeMap.min, timeMap.s, timeMap.mil);
    return res.getTime() + '';
  }
  return (time = new Date(), group = 'day') => {
    time = new Date(time);
    let res = `Y.${time.getFullYear()}`;
    if (timeGroupsMap[group] >= 2) res += `-W.${_getWeek(time)}`;
    if (timeGroupsMap[group] >= 3) res += `-D.${time.getDate()}`;
    if (timeGroupsMap[group] >= 4) res += `-H.${time.getHours()}`;
    if (timeGroupsMap[group] >= 5) res += `-M.${time.getMinutes()}`;
    if (timeGroupsMap[group] >= 6) res += `-S.${time.getSeconds()}`;
    if (timeGroupsMap[group] >= 7) res += `-Mil.${time.getMilliseconds()}`;
    return res;
  }
})();



function getEmptyTimeMap(from, to, value = {}, timeGroup = 'day') {

  let timeSpan
  switch (timeGroup) {
    case 'day': timeSpan = 1
      break;
    case 'week': timeSpan = 7
      break;
    case 'mounth': timeSpan = 30
      break;
    default: timeSpan = 1
      break;
  }

  to = new Date(to)
  var currTime = new Date(from)
  const dayMap = {}
  while (currTime <= to) {
    const timeStr = getTimeStr(currTime, timeGroup)
    if (!dayMap[timeStr]) dayMap[timeStr] = JSON.parse(JSON.stringify(value))
    currTime = new Date(currTime.setDate(currTime.getDate() + timeSpan))
  }
  return dayMap
}

function _getWeek(date) {
  const yearDay1 = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - yearDay1) / (1000*60*60*24));
  const week = Math.floor(days/7);
  return week;
}

module.exports = {
  mapItems,
  mapByTimeGroup,
  getTimeStr,
  getEmptyTimeMap
}
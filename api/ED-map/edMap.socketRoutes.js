const { emitToSocket, getUserFromSession, getSession } = require("../../services/socket.service");
const { minimizeAccount } = require("../account/account.interface");
const { getMsgsMap, parseMsgsMapForUi } = require("./msg.service");

const chatAccounts = [_defaultTestAccount()];
const allMsgs = [];

const MAX_DIST_ACCOUNTS_ARROUND_M = 1000*30000; // 30,000 km;

function connectEdMapRoutes(io, socket) {
  socket.on('send_map_message', async msg => {
    msg.from = socketAccount(socket.user, socket.id, msg.location);
    _addOrUpdateChatAccount(msg.from, socket, msg.location);
    _addChatMsg(msg);

    const allMsgsMap = await getMsgsMap();

    msg.to = msg.to.filter(c => _validateDist(msg.from.location, c.location, allMsgsMap[msg.txt]?.maxDistM));
    if (msg.to?.length) msg.to.forEach(c => c.socketId && emitToSocket(c.socketId).emit('new_map_message', msg));
    if (msg.to?.length) msg.to.forEach(c => c.socketId && emitToSocket(c.socketId).emit('map_room_data', _getRelevantChatDataForUser(c, allMsgsMap)));
  });

  socket.on('update_user_location', async location => {
    _addOrUpdateChatAccount(socket.user, socket, location);
    const allMsgsMap = await getMsgsMap();
    const relevantUsers = chatAccounts.filter(c => _validateDist(location, c.location, MAX_DIST_ACCOUNTS_ARROUND_M));
    relevantUsers.forEach(c => c.socketId && emitToSocket(c.socketId).emit('map_room_data', _getRelevantChatDataForUser(c, allMsgsMap)))
    // socket.emit('map_room_data', _getRelevantChatDataForUser(socket.user, allMsgsMap));
  });
  
  socket.on('join_map_room', async (location) => {
    const user = _addOrUpdateChatAccount(socket.user, socket, location);
    socket.join('map_room');
    const allMsgsMap = await getMsgsMap();
    socket.emit('map_room_data', _getRelevantChatDataForUser(user, allMsgsMap));
  });
  socket.on('leave_map_room', () => {
    socket.leave('map_room');
    _removeChatAccount(socket.user, socket);
  })
}

function _getAccountIdx(account) {
  return chatAccounts.findIndex(c => c._id.toString() === account._id.toString());
}
function _addOrUpdateChatAccount(account, socket, location) {
  const newAccount = socketAccount(account, socket.id, location);
  const idx = _getAccountIdx(account);
  if (idx === -1) chatAccounts.push(newAccount);
  else chatAccounts.splice(idx, 1, newAccount);
  // save account to db?;
  socket.user = newAccount;
  getSession(socket).socketId = socket.id;
  getSession(socket).save();
  return newAccount;
}
function _removeChatAccount(account, socket) {
  const idx = _getAccountIdx(account);
  if (idx !== -1) chatAccounts.splice(idx, 1);
  getSession(socket).socketId = null;
  getSession(socket).save();
}

function _getRelevantChatDataForUser(user, msgsMap) {
  return {
    msgMap: parseMsgsMapForUi(msgsMap),
    accounts: chatAccounts.filter(c => _validateDist(c.location, user.location, MAX_DIST_ACCOUNTS_ARROUND_M)),
    msgs: allMsgs.filter(c => {
      return (
        (c.from._id === user._id
        || c.to.find(curr => curr._id === user._id.toString())
        || !c.to.length)
        && _validateDist(c.location, user.location, c.maxDistM)
      )
    })
  };
}

function _addChatMsg(msg) {
  allMsgs.unshift(msg);
  // save message to db;
}

function socketAccount(account, socketId, location) {
  return {
    ...minimizeAccount(account),
    socketId,
    location
  }
}

module.exports = { connectEdMapRoutes }




function _validateDist(loc1, loc2, maxDistM = 0) {
  const dist = _getDistBetweenLocLatLngInM(loc1, loc2);
  return dist <= maxDistM;
}

function _getDistBetweenLocLatLngInM(loc1, loc2) {
  function _degToRadian(deg) { return deg * (Math.PI / 180); }
  const earthR = 6371; // earth radius in km;
  const latDist = _degToRadian(loc1.lat - loc2.lat);
  const lngDist = _degToRadian(loc1.lng - loc2.lng);

  const a = 
    Math.sin(latDist/2)**2 +
    Math.cos(_degToRadian(loc1.lat)) * Math.cos(_degToRadian(loc2.lat)) *
    Math.sin(lngDist/2)**2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distKm = earthR * c;
  const distM = distKm*1000;
  return distM;
}





function _defaultTestAccount() {
  return {
    username: 'Yahav shual',
    email: 'shual@walla.com',
    _id: '<>TEST_ACOUNT_ID<>',
    socketId: null,
    location: { lat: 30, lng: 30 }
  }
}
setInterval(async () => {
  const testAccount = chatAccounts.find(c => c._id === '<>TEST_ACOUNT_ID<>');
  testAccount.location.lat++;
  testAccount.location.lng++;
  const allMsgsMap = await getMsgsMap();
  chatAccounts.filter(c => c !== testAccount).forEach(c => c.socketId && emitToSocket(c.socketId).emit('map_room_data', _getRelevantChatDataForUser(c, allMsgsMap)));
}, 3000);
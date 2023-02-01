const { emitToSocket, getUserFromSession, getSession } = require("../../services/socket.service");
const { minimizeAccount } = require("../account/account.interface");

const chatAccounts = [];
const allMsgs = [];

function connectChatSocketRoutes(io, socket) {
  socket.on('send_message', msg => {
    const user = getUserFromSession(socket);
    if (!user) return;

    msg.from = socketAccount(user, socket.id);
    allMsgs.unshift(msg);

    if (msg.to?.length) msg.to.forEach(c => emitToSocket(c.socketId).emit('new_message', msg));
    else io.emit('new_message', msg);
  });
  
  socket.on('join_chat_room', () => {
    const user = getUserFromSession(socket);
    if (!user) return;
    addChatAccount(user, socket);
    socket.join('chat_room');
    socket.emit('chat_room_data', { accounts: chatAccounts, msgs: allMsgs });
  });
  socket.on('leave_chat_room', () => {
    socket.leave('chat_room');
    const user = getUserFromSession(socket);
    if (!user) return;
    removeChatAccount(user);
  })
}

function getAccountIdx(account) {
  return chatAccounts.findIndex(c => c._id.toString() === account._id.toString());
}
function addChatAccount(account, socket) {
  const newAccount = socketAccount(account, socket.id);
  const idx = getAccountIdx(account);
  if (idx === -1) chatAccounts.push(newAccount);
  else chatAccounts.splice(idx, 1, newAccount);
}
function removeChatAccount(account) {
  const idx = getAccountIdx(account);
  if (idx !== -1) chatAccounts.splice(idx, 1);
}


function socketAccount(account, socketId) {
  return {
    ...minimizeAccount(account),
    socketId
  }
}

module.exports = { connectChatSocketRoutes }
const { getSocket } = require('../../services/socket.service');
const accountService = require('../account/account.service');
const authService = require('./auth.service');
const _errMsg = require('../../services/utils.service').getCreateErrMsg('auth.controller');


function getLoggedUserInfo(req, res, next) {
  try {
    const user = getUserFromExpressReq(req);
    res.json(user);
  } catch(err) {
    next({msg: _errMsg('Couldnt get user info', 'getLoggedUserInfo', err)})
  }
}

async function _doLogin(req, res) {
  const userData = await authService.login(req.body);
  if (userData.err) return userData;
  // userData.socketId = req.session.socketId;
  req.session.userData = userData;
  res.cookie('token', userData.token);
  return userData;
}

async function login(req, res, next) {
  try {
    const userData = await _doLogin(req, res);
    if (userData.err) return res.status(403).send(userData);
    else res.send({message: 'login success', ...userData });
  } catch(err) {
    next({msg: _errMsg('Couldnt login', 'login', err)});
  }
}

async function signup(req, res, next) {
  try {
    const signupRes = await authService.signup(req.body);
    if (signupRes.err) return res.status(409).send(signupRes);

    const userData = await _doLogin(req, res);
    res.send({message: 'signup success', ...userData});
  } catch(err) {
    next({msg: _errMsg('Couldnt signup', 'signup', err)});
  }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies.token;
    // res.clearCookie(token);
    res.cookie('token', '');
    req.session.userData = null;
    // getSocket(req.session.socketId).user = null; // TODO;
    // req.session.socketId = null;
    await authService.logout(token);

    res.send({message: 'logout successfully'});
  } catch(err) {
    next({msg: _errMsg('Couldnt logout', 'logout', err)});
  }
}

function getUserFromExpressReq(req) {
  const user = req?.session?.userData?.user;
  if (user) user._id = user._id.toString();
  return user;
}

async function updateAccuntSessionData(req) {
  const account = await accountService.get(getUserFromExpressReq(req)._id);
  req.session.userData.user = account;
}


module.exports = {
  getLoggedUserInfo,
  login,
  logout,
  signup,
  getUserFromExpressReq,
  updateAccuntSessionData
}
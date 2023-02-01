const dbService = require('../../services/db.service');
const tokenService = require('../../services/token.service');
const { validateType } = require('../../services/interface.service');
const { account: accountScheme } = require('../account/account.interface');

const { col: accountCol } = require('../account/account.service.js');

async function login({username, password}) {
  if (!username || !password) return {err: 'Required username and password!'};

  const collection = await dbService.getCollection(accountCol);
  const account = await collection.findOne({ username });
  if (!account || (account.password !== password)) return {err: 'Invalid username or password'};

  delete account.password;

  const token = await tokenService.sign(account);
  return { user: account, token };
}

async function logout(token) {
  return Promise.resolve(); // TODO: add token to bloked list / remove token;
}

async function signup(account) {
  const collection = await dbService.getCollection(accountCol);

  const accountWithSameEmail = await collection.findOne({email: account.email});
  if (accountWithSameEmail) return {err: 'Email is already taken'};
  const accountWithSameUsername = await collection.findOne({username: account.username});
  if (accountWithSameUsername) return {err: 'Username is already taken'};

  validateType(accountScheme, account, true);
  return collection.insertOne(account);
}


module.exports = {
  login,
  logout,
  signup
}
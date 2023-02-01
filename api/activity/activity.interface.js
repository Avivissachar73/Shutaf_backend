const accountInterface = require('../account/account.interface').miniUser;

const activityInterface = {
  name: String,
  desc: String,
  at: Date,
  by: accountInterface,
  with: [accountInterface]
}

module.exports = { activityInterface }
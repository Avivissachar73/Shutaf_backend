const accounts = require('../account/account.collection').miniDefaultAccounts;

module.exports = {
  defaultActivities: [
    // {
    //   "name": "Activity 1",
    //   "desc": "Some activity",
    //   "at": new Date(Date.now() - 1000*60*60*24*3),
    //   "by": minimizeAccount(accounts[0]),
    //   "with": [minimizeAccount(accounts[1]), minimizeAccount(accounts[2])]
    // },
    // {
    //   "name": "Activity 2",
    //   "desc": "Some activity",
    //   "at": new Date(Date.now() - 1000*60*60*24*2),
    //   "by": minimizeAccount(accounts[1]),
    //   "with": [minimizeAccount(accounts[0]), minimizeAccount(accounts[2])]
    // },
    // {
    //   "name": "Activity 3",
    //   "desc": "Some activity",
    //   "at": new Date(Date.now() - 1000*60*60*24*1),
    //   "by": minimizeAccount(accounts[2]),
    //   "with": [minimizeAccount(accounts[0]), minimizeAccount(accounts[1])]
    // },
    {
      "name": "dbInit",
      "desc": "Db init",
      "at": new Date(),
      "by": accounts[0],
      "with": []
    }
  ]
}
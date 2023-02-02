const { ObjectId } = require("mongodb");
const { minimizeAccount } = require("./account.interface");


const defaultAccounts = [
  {
    "_id": ObjectId(),
    "username": "Aviv73",
    "firstname": "Aviv",
    "lastname": "Issachar",
    "password": "12345",
    "email": "Aviv@shual.com",
    "roles": ["admin"],
    "organizations": [] // being updated in orgs col file
  },
  // {
  //   "username": "Noam2",
  //   "username": "Noam",
  //   "firstname": "Issachar",
  //   "password": "12345",
  //   "email": "Noam@shual.com",
  //   "role": "user",
  //   "_id": ObjectId()
  // },
  // {
  //   "username": "Or1",
  //   "username": "Or",
  //   "firstname": "Issachar",
  //   "password": "12345",
  //   "email": "Or@shual.com",
  //   "role": "admin",
  //   "_id": ObjectId()
  // },
]


module.exports = {
  defaultAccounts,
  miniDefaultAccounts: defaultAccounts.map(c => minimizeAccount(c))
}
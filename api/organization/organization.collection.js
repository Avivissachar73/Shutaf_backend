const { ObjectId } = require("mongodb");
const { minimizeOrg } = require("./organization.interface");
const accounts = require('../account/account.collection').miniDefaultAccounts;

const defaultOrgs = [
  {
    "name": "Aviv`s organiation",
    "_id": ObjectId(),
    "desc": "Some organization that does some things",
    "_createdBy": accounts[0],
  }
];

const miniDefaultOrgs = defaultOrgs.map(c => minimizeOrg(c))

require('../account/account.collection').defaultAccounts[0].organizations = [{
  ...miniDefaultOrgs[0],
  "roles" : [
      "admin", 
      "creator"
  ],
  "status" : "approved",
  "approverId": miniDefaultOrgs[0]
}];

module.exports = {
  defaultOrgs,
  miniDefaultOrgs
}
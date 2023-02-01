const { ObjectId } = require("mongodb");
const { miniDefaultOrgs } = require("../organization/organization.collection");
const accounts = require('../account/account.collection').miniDefaultAccounts;

module.exports = {
  defaultPosts: [
    {
      "createdBy": accounts[0],
      "type": "reg",
      "content": "this is a post about this telling something about that",
      "organizationId": miniDefaultOrgs[0]
    }
  ]
}
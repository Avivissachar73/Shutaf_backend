const { ObjectId } = require("mongodb");
const { miniDefaultOrgs } = require("../organization/organization.collection");
const { defaultPosts } = require("../post/post.collection");
const accounts = require('../account/account.collection').miniDefaultAccounts;

module.exports = {
  defaultComments: [
    {
      "createdBy": accounts[0],
      "content": "this is a comment about this telling something about WTF??",
      "attachedId": defaultPosts[0],
      "organizationId": miniDefaultOrgs[0]
    }
  ]
}

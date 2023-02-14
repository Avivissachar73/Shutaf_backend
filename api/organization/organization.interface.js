// const { miniUser } = require("../account/account.interface")
const { MongoId } = require('../../services/interface.service/extraClasses');
const { basicSchemeWithCreator } = require('../basicScheme');

module.exports.organization = {
  ...basicSchemeWithCreator,
  name: String,
  desc: String,
  // _createdBy: 'miniUser', // being fixed in file account.interface for circular dependency bug
}

module.exports.miniOrg = {
  name: String,
  _id: MongoId
}

module.exports.minimizeOrg = (org) => ({
  name: org.name,
  _id: org._id.toString()
});
// const { miniUser } = require("../account/account.interface")
const { MongoId } = require('../../services/interface.service/extraClasses')

module.exports.organization = {
  name: String,
  desc: String,
  // _createdBy: 'miniUser', // being fixed in file account.interface for circular dependency bug
  _createdBy: MongoId
}

module.exports.miniOrg = {
  name: String,
  _id: MongoId
}

module.exports.minimizeOrg = (org) => ({
  name: org.name,
  _id: org._id.toString()
});
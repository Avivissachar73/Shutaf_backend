// const { miniUser } = require("../account/account.interface")
const { MongoId } = require('../../services/interface.service/extraClasses')

module.exports.organization = {
  createdBy: 'miniUser', // being fixed in file account.interface for circular dependency bug
  name: String,
  desc: String
}

module.exports.miniOrg = {
  name: String,
  _id: MongoId
}

module.exports.minimizeOrg = (org) => ({
  name: org.name,
  _id: org._id.toString()
});
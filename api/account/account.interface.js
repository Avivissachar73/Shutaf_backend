const { MongoId } = require('../../services/interface.service/extraClasses')
const { miniOrg } = require('../organization/organization.interface')

module.exports.account = {
  username: String,
  firstname: String,
  lastname: String,
  password: String,
  email: String,
  roles: [String],
  organizations: [miniOrg]
}

module.exports.miniUser = {
  username: String,
  email: String,
  _id: MongoId
}

module.exports.minimizeAccount = (account) => ({
  username: account.username,
  email: account.email,
  _id: account._id.toString()
})
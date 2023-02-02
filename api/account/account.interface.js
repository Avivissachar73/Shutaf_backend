const { organizationRoles, userRoles } = require('../../services/const.service')
const { Enumerator } = require('../../services/interface.service')
const { MongoId } = require('../../services/interface.service/extraClasses')
const { miniOrg, organization } = require('../organization/organization.interface')

module.exports.account = {
  username: String,
  firstname: String,
  lastname: String,
  password: String,
  email: String,
  roles: [Enumerator(...Object.values(userRoles))],
  organizations: [{
    ...miniOrg,
    "roles" : [ 
      Enumerator(...Object.values(organizationRoles))
    ],
    "status" : Enumerator("approved", "declined", "pending"),
    approverId: MongoId
  }]
}


module.exports.miniUser = {
  username: String,
  email: String,
  _id: MongoId
}

organization.createdBy = module.exports.miniUser; // fixing for circular dependency;

module.exports.minimizeAccount = (account) => ({
  username: account.username,
  email: account.email,
  _id: account._id.toString()
})
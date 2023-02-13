const { MongoId } = require("../../services/interface.service/extraClasses")
const { miniUser } = require("../account/account.interface")

const postInterface = {
  type: String,
  content: String,
  _createdBy: miniUser,
  _organizationId: MongoId
}

module.exports = { postInterface }
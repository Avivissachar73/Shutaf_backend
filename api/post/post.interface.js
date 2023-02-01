const { MongoId } = require("../../services/interface.service/extraClasses")
const { miniUser } = require("../account/account.interface")

const postInterface = {
  createdBy: miniUser,
  type: String,
  content: String,
  organizationId: MongoId
}

module.exports = { postInterface }
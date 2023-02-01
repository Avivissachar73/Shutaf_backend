const { MongoId } = require("../../services/interface.service/extraClasses")
const { miniUser } = require("../account/account.interface")

const commentInterface = {
  createdBy: miniUser,
  content: String,
  attachedId: MongoId,
  // organizationId: MongoId,
}

module.exports = { commentInterface }
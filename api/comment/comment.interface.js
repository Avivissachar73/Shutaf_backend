const { MongoId } = require("../../services/interface.service/extraClasses")
const { miniUser } = require("../account/account.interface")

const commentInterface = {
  content: String,
  attachedId: MongoId,
  _createdBy: miniUser
}

module.exports = { commentInterface }
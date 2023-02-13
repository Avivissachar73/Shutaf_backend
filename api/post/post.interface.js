const { MongoId } = require("../../services/interface.service/extraClasses");

const postInterface = {
  type: String,
  content: String,
  _createdBy: MongoId,
  _organizationId: MongoId
}

module.exports = { postInterface }
const { MongoId } = require("../../services/interface.service/extraClasses");

const commentInterface = {
  content: String,
  attachedId: MongoId,
  _createdBy: MongoId,
}

module.exports = { commentInterface }
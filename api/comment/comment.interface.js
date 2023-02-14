const { MongoId } = require("../../services/interface.service/extraClasses");
const { basicSchemeWithCreator } = require("../basicScheme");

const commentInterface = {
  ...basicSchemeWithCreator,
  content: String,
  attachedId: MongoId,
}

module.exports = { commentInterface }
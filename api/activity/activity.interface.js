const { Any, MultiType } = require('../../services/interface.service');
const { MongoId } = require("../../services/interface.service/extraClasses");
const { basicSchemeWithCreator } = require('../basicScheme');

const activityInterface = {
  ...basicSchemeWithCreator,
  name: String,
  desc: String,
  with: [MongoId],
  data: Any(),
  attachedId: MultiType(null, MongoId),
}

module.exports = { activityInterface }
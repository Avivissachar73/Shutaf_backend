const { Any, MultiType } = require('../../services/interface.service');
const { MongoId } = require("../../services/interface.service/extraClasses")

const activityInterface = {
  name: String,
  desc: String,
  with: [MongoId],
  data: Any(),
  attachedId: MultiType(null, MongoId),
  _createdBy: MongoId,
}

module.exports = { activityInterface }
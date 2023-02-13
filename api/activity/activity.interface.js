const { Any, MultiType } = require('../../services/interface.service');
const { MongoId } = require("../../services/interface.service/extraClasses")

const accountInterface = require('../account/account.interface').miniUser;

const activityInterface = {
  name: String,
  desc: String,
  with: [accountInterface],
  data: Any(),
  attachedId: MultiType(null, MongoId),
  _createdBy: accountInterface,
}

module.exports = { activityInterface }
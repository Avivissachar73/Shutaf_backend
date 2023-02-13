const { Enumerator } = require('../../services/interface.service');
const { MongoId } = require('../../services/interface.service/extraClasses');

const bugInterface = {
  title: String,
  desc: String,
  status: Enumerator('pending', 'resolved', 'ignored'),
  _createdBy: MongoId,
}

module.exports = { bugInterface }
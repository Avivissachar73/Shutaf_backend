const { Enumerator } = require('../../services/interface.service');
const { MongoId } = require('../../services/interface.service/extraClasses');
const { basicSchemeWithCreator } = require('../basicScheme');

const bugInterface = {
  ...basicSchemeWithCreator,
  title: String,
  desc: String,
  status: Enumerator('pending', 'resolved', 'ignored'),
}

module.exports = { bugInterface }
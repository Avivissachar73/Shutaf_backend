const { Enumerator } = require('../../services/interface.service')
const { miniUser } = require("../account/account.interface")

const bugInterface = {
  title: String,
  desc: String,
  status: Enumerator('pending', 'resolved', 'ignored'),
  _createdBy: miniUser,
}

module.exports = { bugInterface }
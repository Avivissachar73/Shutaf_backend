const { Enumerator } = require('../../services/interface.service')
const { miniUser } = require("../account/account.interface")

const bugInterface = {
  createdBy: miniUser,
  title: String,
  desc: String,
  status: Enumerator('pending', 'resolved', 'ignored')
}

module.exports = { bugInterface }
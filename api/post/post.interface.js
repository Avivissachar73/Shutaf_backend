const { basicSchemeWithOrg } = require("../basicScheme");

const postInterface = {
  ...basicSchemeWithOrg,
  type: String,
  content: String
}

module.exports = { postInterface }
const { MongoId } = require("../services/interface.service/extraClasses")

const basicScheme = {
  _id: MongoId,
  _createdAt: Number,
  _updatedAt: Number,
}

const basicSchemeWithCreator = {
  ...basicScheme,
  _createdBy: MongoId,
}

const basicSchemeWithOrg = {
  ...basicSchemeWithCreator,
  _organizationId: MongoId,
}

module.exports = {
  basicScheme,
  basicSchemeWithCreator,
  basicSchemeWithOrg
}
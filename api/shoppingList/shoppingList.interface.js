const { Range } = require("../../services/interface.service")
const { MongoId } = require("../../services/interface.service/extraClasses")
const { miniUser } = require("../account/account.interface")

const shopingListInterface = {
  title: String,
  createdBy: miniUser,
  products: [
    {
      id: String,
      name: String,
      count: Number,
      minCount: Number,
      maxCount: Number,
      prices: [ { shopName: String, value: Number } ],
      healthRate: Range(1, 10)
    }
  ],
  organizationId: MongoId,
  cart: [String] // productIds
}

module.exports = { shopingListInterface }
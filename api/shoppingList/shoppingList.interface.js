const { Range } = require("../../services/interface.service")
const { basicSchemeWithOrg } = require("../basicScheme")

const shopingListInterface = {
  ...basicSchemeWithOrg,
  title: String,
  products: [
    {
      id: String,
      name: String,
      count: Number,
      minCount: Number,
      maxCount: Number,
      prices: [ { shopName: String, value: Number } ],
      healthRate: Range(1, 10),
      category: String
    }
  ],
  cart: [String], // productIds
}

module.exports = { shopingListInterface }
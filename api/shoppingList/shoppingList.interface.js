const { Range, Enumerator, MultiType } = require("../../services/interface.service")
const { basicSchemeWithOrg } = require("../basicScheme")

const shopingListInterface = {
  ...basicSchemeWithOrg,
  type: Enumerator('smart', 'simple'),
  title: String,
  products: [
    MultiType(
      { // for a smart list item
        id: String,
        name: String,
        count: Number,
        minCount: Number,
        maxCount: Number,
        prices: [ { shopName: String, value: Number } ],
        healthRate: Range(1, 10),
        category: String
      },
      { // for a simple list item
        id: String,
        name: String,
        checked: Boolean
      }
    )
  ],
  cart: [String], // productIds // only form smart type item
}

module.exports = { shopingListInterface }
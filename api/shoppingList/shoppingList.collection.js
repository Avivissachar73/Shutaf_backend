const { ObjectId } = require("mongodb");
const { miniDefaultOrgs } = require("../organization/organization.collection");
const accounts = require('../account/account.collection').miniDefaultAccounts;

module.exports = {
  defaultShoppingLists: [
    {
      "createdBy": accounts[0],
      "organizationId": miniDefaultOrgs[0],

      "title" : "SHOPPING!?",
      "type" : "smart",
      "products" : [ 
          {
              "id" : "13A4-185F8E58B78-1A6C",
              "name" : "cola",
              "count" : 0,
              "minCount" : 3,
              "maxCount" : 10,
              "prices" : [ 
                  {
                      "shopName" : "shupersal",
                      "value" : 5
                  }, 
                  {
                      "shopName" : "mega",
                      "value" : 3
                  }
              ]
          }, 
          {
              "id" : "10C7-18588A8A76E-736",
              "name" : "avodado",
              "count" : 2,
              "minCount" : 5,
              "prices" : [ 
                  {
                      "shopName" : "mega",
                      "value" : 3
                  }, 
                  {
                      "shopName" : "marcol",
                      "value" : 7
                  }
              ],
              "maxCount" : 10
          }, 
          {
              "id" : "1EF1-18588B591D2-1082",
              "name" : "cola",
              "count" : 4,
              "minCount" : 2,
              "prices" : [ 
                  {
                      "shopName" : "mega",
                      "value" : 2
                  }
              ],
              "maxCount" : 4
          }, 
          {
              "id" : "CF2-18588A49DC8-233B",
              "name" : "bread",
              "count" : 0,
              "minCount" : 5,
              "prices" : [ 
                  {
                      "shopName" : "mega",
                      "value" : 2
                  }, 
                  {
                      "shopName" : "shupersal",
                      "value" : 6
                  }, 
                  {
                      "shopName" : "marcol",
                      "value" : 3
                  }, 
                  {
                      "shopName" : "asdo!",
                      "value" : 3
                  }
              ],
              "maxCount" : 7
          }
      ],
      "cart" : [ 
          "10C7-18588A8A76E-736"
      ]
    }
  ]
}
const { ObjectId } = require("mongodb");
const { miniDefaultOrgs } = require("../organization/organization.collection");
const accounts = require('../account/account.collection').miniDefaultAccounts;

module.exports = {
  defaultShoppingLists: [
    {
      "_createdBy": accounts[0]._id,
      "_organizationId": miniDefaultOrgs[0]._id,

      "type" : "smart",
      "title" : "SHOPPING!?",
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
              ],
              "healthRate": 1,
              "category": "juice"
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
              "maxCount" : 10,
              "healthRate": 10,
              "category": "vegetable"
          }, 
          {
              "id" : "1EF1-18588B591D2-1082",
              "name" : "popcorn",
              "count" : 3,
              "minCount" : 1,
              "prices" : [ 
                  {
                      "shopName" : "mega",
                      "value" : 5
                  },
                  {
                      "shopName" : "shupersal",
                      "value" : 7
                  }
              ],
              "maxCount" : 5,
              "healthRate": 1,
              "category": "snack"
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
              "maxCount" : 7,
              "healthRate": 5,
              "category": "carb"
          }
      ],
      "cart" : [ 
          "10C7-18588A8A76E-736"
      ]
    },
    {
        
        "_createdBy": accounts[0]._id,
        "_organizationId": miniDefaultOrgs[0]._id,
        
        "type" : "simple",
        "title" : "simple red",
        "products" : [ 
            {
                "name" : "apples",
                "checked" : false,
                "id" : "13DA-18656A6D2A1-11EB"
            }, 
            {
                "name" : "popcorn",
                "checked" : true,
                "id" : "2359-1865A5A36CF-7AE"
            }, 
            {
                "name" : "watermellon",
                "checked" : false,
                "id" : "118E-1865A5A3F16-247E"
            }, 
            {
                "name" : "bread",
                "checked" : false,
                "id" : "25EB-1865A5A434E-19D3"
            }, 
            {
                "name" : "pizza",
                "checked" : true,
                "id" : "80D-1865A5A4494-ECB"
            }
        ]
    }
  ]
}
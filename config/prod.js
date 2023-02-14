const interfaceService = require('../services/interface.service');
const configInterface = require('./config.scheme');

const prodConf = {
  port: 27017,
  db: {
    name: 'Shutaf',
    url: 'mongodb+srv://SHUTAF_ADMIN:SHUTAF_12345@shutaf.y7k8fvq.mongodb.net/?retryWrites=true'
  }
}

interfaceService.validateType(configInterface, prodConf, true);
module.exports = prodConf
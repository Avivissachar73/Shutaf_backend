const interfaceService = require('../services/interface.service');
const configInterface = require('./config.scheme');

const prodConf = {
  db: {
    name: 'DB_NAME',
    url: 'DB_URL'
  }
}

interfaceService.validateType(configInterface, prodConf, true);
module.exports = prodConf
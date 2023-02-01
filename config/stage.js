const interfaceService = require('../services/interface.service');
const configInterface = require('./config.scheme');

const stageConf = {
  db: {
    name: 'DB_NAME',
    url: 'DB_URL'
  }
}

interfaceService.validateType(configInterface, stageConf, true);
module.exports = stageConf
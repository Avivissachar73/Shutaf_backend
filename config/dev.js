const interfaceService = require('../services/interface.service');
const configInterface = require('./config.scheme');

const devConf = {
  port: 3000,
  db: {
    name: 'Shutaf',
    url: 'mongodb://localhost:27017'
  }
}

interfaceService.validateType(configInterface, devConf, true);
module.exports = devConf
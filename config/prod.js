const interfaceService = require('../services/interface.service');
const configInterface = require('./config.scheme');

const prodConf = {
  db: {
    name: 'Shutaf',
    url: 'mongodb+srv://SHUTAF_ADMIN:SHUTAF_12345@shutaf.y7k8fvq.mongodb.net/?retryWrites=true'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'some_secret_string',
    options: {
      expiresIn: process.env.JWT_EXPIRES || '5h',
      algorithm: process.env.JWT_ALGORITHM || 'HS256'
    }
  }
}

interfaceService.validateType(configInterface, prodConf, true);
module.exports = prodConf
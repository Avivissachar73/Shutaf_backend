const loggerService = require('../services/logger.service.js');
const { createError } = require('../services/utils.service.js');

const errorHandlerMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  loggerService.error(`ERROR ${status}: ${err.msg || err.message}`);

  res.status(status).json(createError('Internal server error', status));
}

module.exports = { errorHandlerMiddleware };
const { createError, noop } = require('../services/utils.service.js');

const CODE = 666; // God sleeps in shabat so Satan handles the error;

function keepShabat(req, res, next) {
  noop(req);
  const isShabat = new Date().getDay() === 6;
  if (isShabat) return res.status(CODE).send(createError('Shabes!', CODE));
  next();
}

module.exports = { keepShabat };

/**
 * TODO:
 * - make sure shabat test is not only 00:00 - 00:00, but for real shabat time;
 * - make sure shabat time is according to user timezone and not server timezone;
 * - write dontPayTaxes middleware;
 * - make sure server is not aware of the existence of math, 
 *   science and housing crisis in Israel;
 */
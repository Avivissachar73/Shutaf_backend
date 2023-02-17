


function log(type, msg, data) {
  console.log(`LOGGER_${type}: ${msg}`);
}


module.exports = {
  info(msg, data) {log('INFO', msg, data)},
  error(msg, data) {log('ERROR', msg, data)},
  warn(msg, data) {log('WARNING', msg, data)},
  debug(msg, data) {log('DEBUG', msg, data)},
}
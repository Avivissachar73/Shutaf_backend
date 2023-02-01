


function log(type, msg) {
  console.log(`LOGGER_${type}: ${msg}`);
}


module.exports = {
  info(msg) {log('INFO', msg)},
  error(msg) {log('ERROR', msg)},
  warn(msg) {log('WARNING', msg)},
  debug(msg) {log('DEBUG', msg)},
}
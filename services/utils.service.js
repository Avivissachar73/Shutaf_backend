
function getCreateErrMsg(fileName) {
  return (msg, funcName, err = '') => `${msg} | at: ${fileName} file, function: ${funcName} | err: ${err.message || err.msg || 'unknown'}`;
}

function createError(err = '', status = 500,  message = '') {
  const error = err.err || err.error || err.message || err.msg || err;
  return {
    err: error,
    status,
    message: message || error,
  }
}

function getOriginsInAllProtocols(...origins) {
  const protocols = ['http', 'https', 'ws', 'wss'];
  return origins.reduce((acc, c) => {
    return [...acc, ...protocols.reduce((_acc, protocol) => {
        return [..._acc, `${protocol}://127.0.0.1:${c}`, `${protocol}://localhost:${c}`];
      }, [])
  ]}, []);
}

function fixDeepQuery(quer) {
  const fixed = {};
  for (let key in quer) fixed[key] = JSON.parse(quer[key]);
  return fixed;
}

function noop() {}; 


module.exports = {
  getCreateErrMsg,
  createError,
  getOriginsInAllProtocols,
  fixDeepQuery,
  noop
}
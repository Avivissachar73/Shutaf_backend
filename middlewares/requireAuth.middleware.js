const tokenService = require('../services/token.service.js');
const { createError } = require('../services/utils.service.js');
const { getUserFromExpressReq } = require('../api/auth/auth.controller.js');

// function requireAuth(req, res, next) {
//   if (!getUserFromExpressReq(req)) return res.status(401).end('Not Authenticated')
// }
async function requireAuth(req, res, next) {
  const token = req.cookies.token;
  const endIt = () => res.status(401).send(createError('Unauthorized, please login.', 401));
  if (!token) return endIt();

  try {
    const decodedUser = await tokenService.verify(token);
    req.user = decodedUser;
    next();
  } catch(err) {
    endIt();
  }
}


module.exports = { requireAuth };
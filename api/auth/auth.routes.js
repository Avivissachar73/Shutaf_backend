const express = require('express');
const authController = require('./auth.controller');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');

const connectAuthRoutes = (server, rootBaseUrl) => {
  const authRouter = express.Router();
  const authBaseUrl = `${rootBaseUrl}/auth`;
  authRouter.get('/info', requireAuth, authController.getLoggedUserInfo);
  authRouter.post('/logout', requireAuth, authController.logout);
  authRouter.post('/login', authController.login);
  authRouter.post('/signup', authController.signup);
  server.use(authBaseUrl, authRouter);
  return authRouter;
}

module.exports = { connectAuthRoutes };
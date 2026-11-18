const {Router} = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware')
const passport = require('passport');

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @description Login user , expects email and password
 * @access Public
 */
authRouter.post('/login', authController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookies and add token in blacklist
 * @access Public
 */
authRouter.post('/logout', authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access Private
 */
authRouter.get("/get-me" ,authMiddleware.authUser, authController.getMeController)

authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  authController.googleCallbackController
);

module.exports = authRouter;
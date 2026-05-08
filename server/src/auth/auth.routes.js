const express = require('express');

const authController = require('./auth.controller');

const validate = require('../middleware/validate.middleware');

const { onlyAdmin, userAuthentication } = require('../middleware/auth.middleware');
const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} = require('./auth.validation');


const router = express.Router();



router.post(
    '/user/create',
    userAuthentication,
    onlyAdmin(),
    validate(registerSchema),
    authController.createUser
);

router.post(
    '/login',
    validate(loginSchema),
    authController.login
);

router.patch(
    '/change-password',
    userAuthentication,
    validate(changePasswordSchema),
    authController.changePassword
);

router.get(
    '/profile',
    userAuthentication,
    authController.profile
);

router.post(
    '/refresh-token',
    authController.refreshToken
);

router.post(
    '/logout',
    userAuthentication,
    authController.logout
);

module.exports = router;

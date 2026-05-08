const express = require('express');

const authController = require('./auth.controller');

const validate = require('../middleware/validate.middleware');

const { onlyAdmin } = require('../middleware/auth.middleware');
const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} = require('./auth.validation');


const router = express.Router();



router.post(
    '/user/create',
    onlyAdmin,
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
    validate(changePasswordSchema),
    authController.changePassword
);

module.exports = router;
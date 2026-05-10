const express = require('express');

const authController = require('./auth.controller');

const validate = require('../../middleware/validate.middleware');

const { userAuthentication } = require('../../middleware/auth.middleware');
const {
  loginSchema,
  changePasswordSchema,
} = require('./auth.validation');


const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and profile routes
 *
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and set auth cookies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Invalid credentials.
 */
router.post(
    '/login',
    validate(loginSchema),
    authController.login
);

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     tags: [Auth]
 *     summary: Change current user password
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 maxLength: 72
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.patch(
    '/change-password',
    userAuthentication,
    validate(changePasswordSchema),
    authController.changePassword
);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully.
 *       401:
 *         description: Unauthorized.
 */
router.get(
    '/profile',
    userAuthentication,
    authController.profile
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh auth cookies using refresh token cookie
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 *       401:
 *         description: Invalid or expired refresh token.
 */
router.post(
    '/refresh-token',
    authController.refreshToken
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout current user
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful.
 *       401:
 *         description: Unauthorized.
 */
router.post(
    '/logout',
    userAuthentication,
    authController.logout
);

module.exports = router;

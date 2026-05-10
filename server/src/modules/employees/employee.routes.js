const express = require("express");
const employeeController = require("./employee.controller");
const validate = require("../../middleware/validate.middleware");
const { onlyAdmin, userAuthentication } = require("../../middleware/auth.middleware");
const { employeeSchema, updateEmployeeSchema } = require("./employee.validation");

const router = express.Router();

router.use(onlyAdmin());

/**
 * @swagger
 * tags:
 *   - name: Employees
 *     description: Admin employee management routes
 *
 * /employees:
 *   get:
 *     tags: [Employees]
 *     summary: List employees
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Employees fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 */
router.get("/", employeeController.listEmployees);

/**
 * @swagger
 * /employees:
 *   post:
 *     tags: [Employees]
 *     summary: Create employee
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 120
 *                 example: Jane Employee
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 maxLength: 72
 *                 example: Password@123
 *     responses:
 *       201:
 *         description: Employee created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       409:
 *         description: Email already exists.
 */
router.post("/", validate(employeeSchema), employeeController.createEmployee);

/**
 * @swagger
 * /employees/{id}:
 *   patch:
 *     tags: [Employees]
 *     summary: Update employee
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 120
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 maxLength: 72
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Employee updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Employee not found.
 */
router.patch("/:id", validate(updateEmployeeSchema), employeeController.updateEmployee);

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     tags: [Employees]
 *     summary: Deactivate employee
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Employee removed successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Employee not found.
 */
router.delete("/:id", employeeController.removeEmployee);

module.exports = router;

const Joi = require("joi");

const employeeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string()
    .min(8)
    .max(72)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])/)
    .required(),
});

const updateEmployeeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  email: Joi.string().trim().lowercase().email(),
  password: Joi.string()
    .min(8)
    .max(72)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])/),
  active: Joi.boolean(),
}).min(1);

module.exports = {
  employeeSchema,
  updateEmployeeSchema,
};

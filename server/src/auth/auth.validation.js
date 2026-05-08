const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(120)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 120 characters',
      'any.required': 'Name is required',
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .min(8)
    .max(72)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])/)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.max': 'Password must not exceed 72 characters',
      'string.pattern.base':
        'Password must contain uppercase, lowercase, number and special character',
      'any.required': 'Password is required',
    }),

  type: Joi.string()
    .valid('ADMIN', 'EMPLOYEE')
    .default('EMPLOYEE')
    .messages({
      'any.only': 'User type must be ADMIN or EMPLOYEE',
    }),

  roleIds: Joi.array()
    .items(Joi.string().guid({ version: ['uuidv4', 'uuidv5'] }))
    .unique()
    .default([])
    .messages({
      'string.guid': 'Role id must be a valid UUID',
      'array.unique': 'Role ids must be unique',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .required()
    .messages({
      'string.empty': 'Old password is required',
      'any.required': 'Old password is required',
    }),

  newPassword: Joi.string()
    .min(8)
    .max(72)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])/)
    .required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 8 characters',
      'string.max': 'New password must not exceed 72 characters',
      'string.pattern.base':
        'New password must contain uppercase, lowercase, number and special character',
      'any.required': 'New password is required',
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
};

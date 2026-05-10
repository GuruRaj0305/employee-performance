const Joi = require('joi');

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
  loginSchema,
  changePasswordSchema,
};

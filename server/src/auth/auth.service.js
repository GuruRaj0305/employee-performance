const { User, Role, Permission } = require('../models/index.model');
const { compare } = require('../utils/passwd');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/auth');

const userAttributes = ['id', 'name', 'emailId', 'type', 'active', 'createdAt', 'updatedAt'];

const roleInclude = {
  model: Role,
  as: 'roles',
  attributes: ['id', 'name', 'code', 'description'],
  through: { attributes: [] },
  include: [
    {
      model: Permission,
      as: 'permissions',
      attributes: ['id', 'code', 'name', 'description'],
      through: { attributes: [] },
    },
  ],
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const createTokenPayload = (user) => {
  const plainUser = typeof user.get === 'function' ? user.get({ plain: true }) : user;
  const roles = plainUser.roles || [];

  return {
    id: plainUser.id,
    emailId: plainUser.emailId,
    type: plainUser.type,
    roleCodes: roles.map((role) => role.code),
  };
};

const sanitizeUser = (user) => {
  const plainUser = typeof user.get === 'function' ? user.get({ plain: true }) : user;
  const roles = plainUser.roles || [];

  return {
    id: plainUser.id,
    name: plainUser.name,
    emailId: plainUser.emailId,
    type: plainUser.type,
    active: plainUser.active,
    roles,
    roleCodes: roles.map((role) => role.code),
    permissionCodes: [
      ...new Set(
        roles.flatMap((role) =>
          role.permissions?.map((permission) => permission.code) || []
        )
      ),
    ],
  };
};

const registerUser = async (data) => {
  const {
    name,
    email,
    password,
    roleIds = [],
  } = data;
  const normalizedEmail = normalizeEmail(email);
  const type = 'EMPLOYEE';

  if (!name || !normalizedEmail || !password) {
    const error = new Error('Name, email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({
    where: { emailId: normalizedEmail },
  });

  if (existingUser) {
    const error = new Error('Email already exists');
    error.statusCode = 409;
    throw error;
  }

  const roles = await findRoles(roleIds);

  const user = await User.create({
    name,
    emailId: normalizedEmail,
    password,
    type,
    active: true,
  });

  if (roles.length > 0) {
    await user.setRoles(roles);
  }

  const userWithRoles = await findUserWithRoles(user.id);

  return {
    user: sanitizeUser(userWithRoles),
  };
};

const loginUser = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ where: { emailId: normalizedEmail } });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (user.active === false) {
    const error = new Error('User account is inactive');
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const userWithRoles = await findUserWithRoles(user.id);
  const payload = createTokenPayload(userWithRoles);

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user: sanitizeUser(userWithRoles),
    accessToken,
    refreshToken,
  };
};

const getProfile = async (userId) => {
  const user = await findUserWithRoles(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user);
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error('Refresh token is required');
    error.statusCode = 401;
    throw error;
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    const error = new Error('Invalid or expired refresh token');
    error.statusCode = 401;
    throw error;
  }

  const user = await findUserWithRoles(decoded.id);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.active === false) {
    const error = new Error('User account is inactive');
    error.statusCode = 403;
    throw error;
  }

  const payload = createTokenPayload(user);

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const changePassword = async (userId, data) => {
  const { oldPassword, newPassword } = data;

  if (!oldPassword || !newPassword) {
    const error = new Error('Old password and new password are required');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByPk(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const isPasswordValid = await compare(oldPassword, user.password);

  if (!isPasswordValid) {
    const error = new Error('Old password is incorrect');
    error.statusCode = 401;
    throw error;
  }

  await user.update({
    password: newPassword,
  });

  return {
    message: 'Password changed successfully',
  };
};

const findUserWithRoles = (userId) => {
  return User.findByPk(userId, {
    attributes: userAttributes,
    include: [roleInclude],
  });
};

const findRoles = async (roleIds = []) => {
  const uniqueRoleIds = [...new Set(roleIds)];

  if (uniqueRoleIds.length === 0) {
    return [];
  }

  const roles = await Role.findAll({
    where: { id: uniqueRoleIds },
  });

  const foundRoleIds = new Set(roles.map((roleItem) => roleItem.id));
  const missingRoleIds = uniqueRoleIds.filter((roleId) => !foundRoleIds.has(roleId));

  if (missingRoleIds.length > 0) {
    const error = new Error('One or more roles were not found');
    error.statusCode = 400;
    error.details = { roleIds: missingRoleIds };
    throw error;
  }

  return roles;
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  refreshAccessToken,
  changePassword,
};

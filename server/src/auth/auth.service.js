const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/passwd');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt');

const createTokenPayload = (user) => {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
};

const sanitizeUser = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };
};

const registerUser = async (data) => {
  const { name, email, password, role } = data;

  if (!name || !email || !password) {
    const error = new Error('Name, email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    const error = new Error('Email already exists');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'employee',
    isActive: true,
  });

  const payload = createTokenPayload(user);

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

const loginUser = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (user.isActive === false) {
    const error = new Error('User account is inactive');
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const payload = createTokenPayload(user);

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'name', 'email', 'type', 'isActive', 'createdAt', 'updatedAt'],
    
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
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

  const user = await User.findByPk(decoded.id);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.isActive === false) {
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

  const isPasswordValid = await comparePassword(oldPassword, user.password);

  if (!isPasswordValid) {
    const error = new Error('Old password is incorrect');
    error.statusCode = 401;
    throw error;
  }

  const hashedPassword = await hashPassword(newPassword);

  await user.update({
    password: hashedPassword,
  });

  return {
    message: 'Password changed successfully',
  };
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  refreshAccessToken,
  changePassword,
};
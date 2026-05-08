
require('dotenv').config();

const jwt = require('jsonwebtoken');

const getEnvValue = (key, fallbackValue = '') => {
  return String(process.env[key] || fallbackValue).split('#')[0].trim();
};

const getJwtExpiresIn = (key, fallbackValue) => {
  const value = getEnvValue(key, fallbackValue);

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  return value;
};

const JWT_SECRET = getEnvValue('JWT_SECRET');
const JWT_REFRESH_SECRET = getEnvValue('JWT_REFRESH_SECRET', JWT_SECRET);
const JWT_EXPIRES_IN = getJwtExpiresIn('JWT_EXPIRES', '15m');
const JWT_REFRESH_EXPIRES_IN = getJwtExpiresIn(
  'JWT_REFRESH_EXPIRES',
  getEnvValue('REFRESH_TOKEN_EXPIRES', '7d')
);

// Ensure Secrets are set in env
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in .env');
}
if (!JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET is required in .env');
}

const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};

require("dotenv").config();

const jwt = require("jsonwebtoken");

const getEnvValue = (key, fallbackValue = "") => {
  return String(process.env[key] || fallbackValue)
    .split("#")[0]
    .trim();
};

const getJwtExpiresIn = (key, fallbackValue) => {
  const value = getEnvValue(key, fallbackValue);

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  return value;
};

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || JWT_EXPIRES_IN;

// Ensure Secrets are set in env
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required in .env");
}

if (!JWT_ExPIRES_IN) {
  throw new Error("JWT_EXPIRES_IN is required in .env");
}

const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
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
  verifyRefreshToken,
};

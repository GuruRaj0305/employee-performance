const {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
  CLEAR_AUTH_COOKIE_OPTIONS,
} = require('../../config/config');

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
  res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
};

const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', CLEAR_AUTH_COOKIE_OPTIONS);
  res.clearCookie('refreshToken', CLEAR_AUTH_COOKIE_OPTIONS);
};

module.exports = {
  setAuthCookies,
  clearAuthCookies,
};

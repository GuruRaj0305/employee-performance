const { ACCESS_TOKEN_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_OPTIONS } = require('../../config/config');

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
  res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
};

const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', ACCESS_TOKEN_COOKIE_OPTIONS);
  res.clearCookie('refreshToken', REFRESH_TOKEN_COOKIE_OPTIONS);
};

module.exports = {
  setAuthCookies,
  clearAuthCookies,
};
const authService = require("./auth.service");
const { setAuthCookies, clearAuthCookies } = require("../../utils/cookie");

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const profile = async (req, res) => {
  try {
    const result = await authService.getProfile(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshTokenFromCookie = req.cookies.refreshToken;

    const result = await authService.refreshAccessToken(refreshTokenFromCookie);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    clearAuthCookies(res);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const result = await authService.changePassword(req.user.id, req.body);

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: `${result.message}. Please login again.`,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const logout = async (req, res) => {
  clearAuthCookies(res);

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

module.exports = {
  login,
  profile,
  refreshToken,
  changePassword,
  logout,
};

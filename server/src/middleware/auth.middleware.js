const { verifyAccessToken } = require('../utils/auth');
const { User } = require('../models/index.model');

const userAuthentication = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    let decoded;

    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired access token',
      });
    }

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'emailId', 'type', 'active'],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.active === false) {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive',
      });
    }

    req.user = user.get({ plain: true });

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

const onlyAdmin = () => {
  return (req, res, next) => {
    if (req.user?.type !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }
    next();
  };
};

module.exports = {
  userAuthentication,
  onlyAdmin,
};

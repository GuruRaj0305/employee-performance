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
      attributes: ['id', 'name', 'email', 'type', 'isActive'],
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'name', 'code', 'description'],
          through: {
            attributes: [],
          },
          include: [
            {
              model: Permission,
              as: 'permissions',
              attributes: ['id', 'code', 'name', 'description'],
              through: {
                attributes: [],
              },
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive',
      });
    }

    const plainUser = user.get({ plain: true });

    req.user = {
      ...plainUser,
      roleCodes: plainUser.roles?.map((role) => role.code) || [],
      permissionCodes:
        plainUser.roles?.flatMap((role) =>
          role.permissions?.map((permission) => permission.code) || []
        ) || [],
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

const authorizeAnyPermission = (...allowedPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.user?.permissionCodes || [];

    const hasPermission = allowedPermissions.some((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied',
      });
    }

    next();
  };
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
}

module.exports = {
  userAuthentication,
  authorizeAnyPermission,
  onlyAdmin,
};
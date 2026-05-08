const Sequelize = require('sequelize');
const config = require('../../config/database');

const dbConfig = config['development'];

const db = {};

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.User = require('./users/user.model')(
  sequelize,
  Sequelize.DataTypes
);

db.Role = require('./roles/role.model')(
  sequelize,
  Sequelize.DataTypes
);

db.UserRole = require('./roles/user-role.model')(
  sequelize,
  Sequelize.DataTypes
);

db.Permission = require('./permissions/permission.model')(
  sequelize,
  Sequelize.DataTypes
);

db.RolePermission = require('./permissions/role-permission.model')(
  sequelize,
  Sequelize.DataTypes
);

// Department related models
db.Department = require('./departments/department.model')(
  sequelize,
  Sequelize.DataTypes
);

db.DepartmentUser = require('./departments/department-user.model')(
  sequelize,
  Sequelize.DataTypes
);

// Performance factor models
db.PerformanceFactor = require('./performance-factors/performance-factor.model')(
  sequelize,
  Sequelize.DataTypes
);

// Review session models
db.ReviewSession = require('./review-sessions/review-session.model')(
  sequelize,
  Sequelize.DataTypes
);

db.ReviewSessionFactor = require('./review-sessions/review-session-factor.model')(
  sequelize,
  Sequelize.DataTypes
);

// Review opening models
db.ReviewOpenDept = require('./review-open-depts/review-open-dept.model')(
  sequelize,
  Sequelize.DataTypes
);

db.ReviewOpenUser = require('./review-open-users/review-open-user.model')(
  sequelize,
  Sequelize.DataTypes
);

// Others review models
db.OthersReview = require('./others-reviews/others-review.model')(
  sequelize,
  Sequelize.DataTypes
);

// Run associate() for every model that defines it
Object.keys(db).forEach((modelName) => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;

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

db.PerformanceCycle = require('./performance-cycles/performance-cycle.model')(
  sequelize,
  Sequelize.DataTypes
);

// Review session models
db.ReviewSession = require('./review-sessions/review-session.model')(
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

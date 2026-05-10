const { hash } = require('../../utils/passwd');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    emailId: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
      field: 'email_id',
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('ADMIN', 'EMPLOYEE'),
      allowNull: false,
      defaultValue: 'EMPLOYEE',
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
       //hash password before create
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await hash(user.password);
        }
      },
      //update password with hashed
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await hash(user.password);
        }
      },
    }
  });

  User.associate = (models) => {
    User.hasMany(models.ReviewOpenUser, {
      foreignKey: 'userId',
      as: 'openedReviewUsers',
    });

    User.hasMany(models.ReviewOpenUser, {
      foreignKey: 'userRefId',
      as: 'targetReviewUsers',
    });

    User.hasMany(models.OthersReview, {
      foreignKey: 'reviewerId',
      as: 'reviewsGiven',
    });

    User.hasMany(models.OthersReview, {
      foreignKey: 'revieweeId',
      as: 'reviewsReceived',
    });
  };

  return User;
};

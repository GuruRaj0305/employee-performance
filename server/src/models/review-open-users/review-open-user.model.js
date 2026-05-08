module.exports = (sequelize, DataTypes) => {
  const ReviewOpenUser = sequelize.define('ReviewOpenUser', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reviewOpenDeptId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'review_open_dept_id',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      comment: 'Reviewer user id',
    },
    userRefId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_ref_id',
      comment: 'User who will be reviewed',
    },
  }, {
    tableName: 'review_open_users',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['review_open_dept_id', 'user_id', 'user_ref_id'] },
    ],
  });

  ReviewOpenUser.associate = (models) => {
    ReviewOpenUser.belongsTo(models.ReviewOpenDept, {
      foreignKey: 'reviewOpenDeptId',
      as: 'reviewOpenDept',
    });

    ReviewOpenUser.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    ReviewOpenUser.belongsTo(models.User, {
      foreignKey: 'userRefId',
      as: 'userRef',
    });

    ReviewOpenUser.hasMany(models.OthersReview, {
      foreignKey: 'reviewOpenUserId',
      as: 'othersReviews',
    });
  };

  return ReviewOpenUser;
};

module.exports = (sequelize, DataTypes) => {
  const OthersReview = sequelize.define('OthersReview', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reviewOpenUserId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'review_open_user_id',
    },
    reviewSessionId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'review_session_id',
    },
    reviewerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'reviewer_id',
    },
    revieweeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'reviewee_id',
    },
    performanceFactorId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'performance_factor_id',
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    star: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
  }, {
    tableName: 'others_reviews',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['review_session_id'] },
      { fields: ['reviewer_id'] },
      { fields: ['reviewee_id'] },
      { fields: ['performance_factor_id'] },
    ],
  });

  OthersReview.associate = (models) => {
    OthersReview.belongsTo(models.ReviewOpenUser, {
      foreignKey: 'reviewOpenUserId',
      as: 'reviewOpenUser',
    });

    OthersReview.belongsTo(models.ReviewSession, {
      foreignKey: 'reviewSessionId',
      as: 'reviewSession',
    });

    OthersReview.belongsTo(models.User, {
      foreignKey: 'reviewerId',
      as: 'reviewer',
    });

    OthersReview.belongsTo(models.User, {
      foreignKey: 'revieweeId',
      as: 'reviewee',
    });

    OthersReview.belongsTo(models.PerformanceFactor, {
      foreignKey: 'performanceFactorId',
      as: 'performanceFactor',
    });
  };

  return OthersReview;
};

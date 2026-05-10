module.exports = (sequelize, DataTypes) => {
  const ReviewSession = sequelize.define(
    "ReviewSession",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      performanceCycleId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "performance_cycle_id",
      },
      targetUserId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "target_user_id",
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "review_sessions",
      timestamps: true,
      underscored: true,
    },
  );

  ReviewSession.associate = (models) => {
    ReviewSession.belongsTo(models.PerformanceCycle, {
      foreignKey: "performanceCycleId",
      as: "performanceCycle",
    });

    ReviewSession.belongsTo(models.User, {
      foreignKey: "targetUserId",
      as: "targetUser",
    });

    ReviewSession.hasMany(models.OthersReview, {
      foreignKey: "reviewSessionId",
      as: "othersReviews",
    });

    ReviewSession.hasMany(models.ReviewOpenUser, {
      foreignKey: "reviewSessionId",
      as: "reviewOpenUsers",
    });
  };

  return ReviewSession;
};

module.exports = (sequelize, DataTypes) => {
  const PerformanceFactor = sequelize.define('PerformanceFactor', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    weightage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'performance_factors',
    timestamps: true,
    underscored: true,
  });

  PerformanceFactor.associate = (models) => {
    PerformanceFactor.belongsToMany(models.ReviewSession, {
      through: models.ReviewSessionFactor,
      foreignKey: 'performanceFactorId',
      otherKey: 'reviewSessionId',
      as: 'reviewSessions',
    });

    PerformanceFactor.hasMany(models.OthersReview, {
      foreignKey: 'performanceFactorId',
      as: 'othersReviews',
    });
  };

  return PerformanceFactor;
};

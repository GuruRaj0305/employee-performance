module.exports = (sequelize, DataTypes) => {
  const ReviewSession = sequelize.define('ReviewSession', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'department_id',
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fromDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'from_date',
    },
    toDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'to_date',
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'review_sessions',
    timestamps: true,
    underscored: true,
  });

  ReviewSession.associate = (models) => {
    ReviewSession.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department',
    });

    ReviewSession.belongsToMany(models.PerformanceFactor, {
      through: models.ReviewSessionFactor,
      foreignKey: 'reviewSessionId',
      otherKey: 'performanceFactorId',
      as: 'performanceFactors',
    });

    ReviewSession.hasMany(models.OthersReview, {
      foreignKey: 'reviewSessionId',
      as: 'othersReviews',
    });

    ReviewSession.hasMany(models.ReviewOpenDept, {
      foreignKey: 'reviewSessionId',
      as: 'reviewOpenDepts',
    });
  };

  return ReviewSession;
};

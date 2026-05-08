module.exports = (sequelize, DataTypes) => {
  const ReviewSessionFactor = sequelize.define('ReviewSessionFactor', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reviewSessionId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'review_session_id',
    },
    performanceFactorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'performance_factor_id',
    },
  }, {
    tableName: 'review_session_factors',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['review_session_id', 'performance_factor_id'] },
    ],
  });

  return ReviewSessionFactor;
};

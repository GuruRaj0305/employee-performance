module.exports = (sequelize, DataTypes) => {
  const PerformanceCycle = sequelize.define(
    "PerformanceCycle",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      tableName: "performance_cycles",
      timestamps: true,
      underscored: true,
    },
  );

  PerformanceCycle.associate = (models) => {
    PerformanceCycle.hasMany(models.ReviewSession, {
      foreignKey: "performanceCycleId",
      as: "reviewSessions",
    });
  };

  return PerformanceCycle;
};

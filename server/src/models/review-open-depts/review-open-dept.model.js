module.exports = (sequelize, DataTypes) => {
  const ReviewOpenDept = sequelize.define('ReviewOpenDept', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'department_id',
    },
    reviewSessionId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'review_session_id',
    },
  }, {
    tableName: 'review_open_depts',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['department_id', 'review_session_id'] },
    ],
  });

  ReviewOpenDept.associate = (models) => {
    ReviewOpenDept.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department',
    });

    ReviewOpenDept.belongsTo(models.ReviewSession, {
      foreignKey: 'reviewSessionId',
      as: 'reviewSession',
    });

    ReviewOpenDept.hasMany(models.ReviewOpenUser, {
      foreignKey: 'reviewOpenDeptId',
      as: 'reviewOpenUsers',
    });
  };

  return ReviewOpenDept;
};

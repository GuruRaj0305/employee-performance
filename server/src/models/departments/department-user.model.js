module.exports = (sequelize, DataTypes) => {
  const DepartmentUser = sequelize.define('DepartmentUser', {
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
  }, {
    tableName: 'department_users',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['department_id', 'user_id'] },
    ],
  });

  return DepartmentUser;
};

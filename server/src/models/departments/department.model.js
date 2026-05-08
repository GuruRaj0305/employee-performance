module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
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
  }, {
    tableName: 'departments',
    timestamps: true,
    underscored: true,
  });

  Department.associate = (models) => {
    Department.belongsToMany(models.User, {
      through: models.DepartmentUser,
      foreignKey: 'departmentId',
      otherKey: 'userId',
      as: 'users',
    });

    Department.hasMany(models.ReviewOpenDept, {
      foreignKey: 'departmentId',
      as: 'reviewOpenDepts',
    });

    Department.hasMany(models.ReviewSession, {
      foreignKey: 'departmentId',
      as: 'reviewSessions',
    });
  };

  return Department;
};

module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'role_id',
    },
    
  }, {
    tableName: 'user_roles',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['user_id', 'role_id'] },
    ],
  });

  return UserRole;
};

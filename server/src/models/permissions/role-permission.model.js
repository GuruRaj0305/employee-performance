module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define('RolePermission', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'role_id',
    },
    permissionId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'permission_id',
    },
  }, {
    tableName: 'role_permissions',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['role_id', 'permission_id'] },
    ],
  });

  return RolePermission;
};

"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";', {
        transaction,
      });

      await queryInterface.createTable(
        "users",
        {
          id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal("gen_random_uuid()"),
          },
          name: {
            type: Sequelize.STRING(120),
            allowNull: false,
          },
          email_id: {
            type: Sequelize.STRING(150),
            allowNull: false,
          },
          password: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          type: {
            type: Sequelize.ENUM("ADMIN", "EMPLOYEE"),
            allowNull: false,
            defaultValue: "EMPLOYEE",
          },
          active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn("NOW"),
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn("NOW"),
          },
        },
        { transaction },
      );

      await queryInterface.addIndex("users", ["email_id"], {
        unique: true,
        name: "users_email_id_unique",
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable("users", { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_type";', {
        transaction,
      });
    });
  },
};

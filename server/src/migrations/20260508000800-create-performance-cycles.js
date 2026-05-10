"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        "performance_cycles",
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
          description: {
            type: Sequelize.STRING(255),
            allowNull: true,
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

      await queryInterface.addIndex("performance_cycles", ["name"], {
        unique: true,
        name: "performance_cycles_name_unique",
        transaction,
      });

      await queryInterface.addIndex("performance_cycles", ["active"], {
        name: "performance_cycles_active_idx",
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("performance_cycles");
  },
};

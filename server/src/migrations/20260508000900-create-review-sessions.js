"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        "review_sessions",
        {
          id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal("gen_random_uuid()"),
          },
          performance_cycle_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: "performance_cycles",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
          },
          target_user_id: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: "users",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
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

      await queryInterface.addIndex("review_sessions", ["performance_cycle_id"], {
        name: "review_sessions_performance_cycle_id_idx",
        transaction,
      });

      await queryInterface.addIndex("review_sessions", ["target_user_id"], {
        name: "review_sessions_target_user_id_idx",
        transaction,
      });

      await queryInterface.addIndex("review_sessions", ["active"], {
        name: "review_sessions_active_idx",
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("review_sessions");
  },
};

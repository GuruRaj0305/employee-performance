"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        "others_reviews",
        {
          id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal("gen_random_uuid()"),
          },
          review_open_user_id: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: "review_open_users",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          },
          review_session_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: "review_sessions",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          reviewer_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: "users",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
          },
          reviewee_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: "users",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
          },
          title: {
            type: Sequelize.STRING(150),
            allowNull: false,
          },
          detail: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          star: {
            type: Sequelize.INTEGER,
            allowNull: false,
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

      await queryInterface.addConstraint("others_reviews", {
        fields: ["star"],
        type: "check",
        name: "others_reviews_star_between_1_and_5",
        where: {
          star: {
            [Sequelize.Op.between]: [1, 5],
          },
        },
        transaction,
      });

      await queryInterface.addIndex("others_reviews", ["review_open_user_id"], {
        name: "others_reviews_review_open_user_id_idx",
        transaction,
      });

      await queryInterface.addIndex("others_reviews", ["review_session_id"], {
        name: "others_reviews_review_session_id_idx",
        transaction,
      });

      await queryInterface.addIndex("others_reviews", ["reviewer_id"], {
        name: "others_reviews_reviewer_id_idx",
        transaction,
      });

      await queryInterface.addIndex("others_reviews", ["reviewee_id"], {
        name: "others_reviews_reviewee_id_idx",
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("others_reviews");
  },
};

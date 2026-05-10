'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'review_open_users',
        {
          id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('gen_random_uuid()'),
          },
          review_session_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'review_sessions',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          user_id: {
            type: Sequelize.UUID,
            allowNull: false,
            comment: 'Reviewer user id',
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },
          user_ref_id: {
            type: Sequelize.UUID,
            allowNull: false,
            comment: 'User who will be reviewed',
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('NOW'),
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('NOW'),
          },
        },
        { transaction }
      );

      await queryInterface.addIndex(
        'review_open_users',
        ['review_session_id', 'user_id', 'user_ref_id'],
        {
          unique: true,
          name: 'review_open_users_session_reviewer_reviewee_unique',
          transaction,
        }
      );

      await queryInterface.addIndex('review_open_users', ['user_id'], {
        name: 'review_open_users_user_id_idx',
        transaction,
      });

      await queryInterface.addIndex('review_open_users', ['user_ref_id'], {
        name: 'review_open_users_user_ref_id_idx',
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('review_open_users');
  },
};

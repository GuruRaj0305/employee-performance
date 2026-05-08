'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('review_open_users', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      review_open_dept_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'review_open_depts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_ref_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.addConstraint('review_open_users', {
      fields: ['review_open_dept_id', 'user_id', 'user_ref_id'],
      type: 'unique',
      name: 'review_open_users_open_dept_user_ref_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('review_open_users');
  },
};

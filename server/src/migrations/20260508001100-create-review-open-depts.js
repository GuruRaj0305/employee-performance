'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('review_open_depts', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      department_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'departments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      review_session_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'review_sessions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.addConstraint('review_open_depts', {
      fields: ['department_id', 'review_session_id'],
      type: 'unique',
      name: 'review_open_depts_department_id_session_id_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('review_open_depts');
  },
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('review_session_factors', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      review_session_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'review_sessions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      performance_factor_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'performance_factors', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.addConstraint('review_session_factors', {
      fields: ['review_session_id', 'performance_factor_id'],
      type: 'unique',
      name: 'review_session_factors_session_id_factor_id_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('review_session_factors');
  },
};

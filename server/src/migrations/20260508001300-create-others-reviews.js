'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('others_reviews', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      review_open_user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'review_open_users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      review_session_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'review_sessions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      reviewer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      reviewee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      performance_factor_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'performance_factors', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      title: { type: Sequelize.STRING(150), allowNull: false },
      detail: { type: Sequelize.TEXT, allowNull: true },
      star: { type: Sequelize.INTEGER, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.addIndex('others_reviews', ['review_session_id']);
    await queryInterface.addIndex('others_reviews', ['reviewer_id']);
    await queryInterface.addIndex('others_reviews', ['reviewee_id']);
    await queryInterface.addIndex('others_reviews', ['performance_factor_id']);

    await queryInterface.addConstraint('others_reviews', {
      fields: ['star'],
      type: 'check',
      name: 'others_reviews_star_between_1_and_5',
      where: {
        star: {
          [Sequelize.Op.between]: [1, 5],
        },
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('others_reviews');
  },
};

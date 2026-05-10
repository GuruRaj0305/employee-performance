'use strict';

const { randomUUID } = require('crypto');

const indexExists = async (queryInterface, tableName, indexName) => {
  const indexes = await queryInterface.showIndex(tableName);
  return indexes.some((index) => index.name === indexName);
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const table = await queryInterface.describeTable('review_sessions');

      if (!table.performance_cycle_id) {
        const [cycles] = await queryInterface.sequelize.query(
          'SELECT id FROM performance_cycles WHERE name = :name LIMIT 1',
          {
            replacements: { name: 'Default Performance Cycle' },
            transaction,
          }
        );

        let defaultCycle = cycles[0];

        if (!defaultCycle) {
          defaultCycle = { id: randomUUID() };
          await queryInterface.bulkInsert(
            'performance_cycles',
            [
              {
                id: defaultCycle.id,
                name: 'Default Performance Cycle',
                description: 'Migrated review sessions',
                active: true,
                created_at: new Date(),
                updated_at: new Date(),
              },
            ],
            { transaction }
          );
        }

        await queryInterface.addColumn(
          'review_sessions',
          'performance_cycle_id',
          {
            type: Sequelize.UUID,
            allowNull: true,
            references: { model: 'performance_cycles', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },
          { transaction }
        );

        await queryInterface.sequelize.query(
          'UPDATE review_sessions SET performance_cycle_id = :performanceCycleId WHERE performance_cycle_id IS NULL',
          {
            replacements: { performanceCycleId: defaultCycle.id },
            transaction,
          }
        );

        await queryInterface.changeColumn(
          'review_sessions',
          'performance_cycle_id',
          {
            type: Sequelize.UUID,
            allowNull: false,
            references: { model: 'performance_cycles', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },
          { transaction }
        );
      }

      const updatedTable = await queryInterface.describeTable('review_sessions');

      if (updatedTable.from_date) {
        await queryInterface.removeColumn('review_sessions', 'from_date', { transaction });
      }

      if (updatedTable.to_date) {
        await queryInterface.removeColumn('review_sessions', 'to_date', { transaction });
      }

      if (!(await indexExists(queryInterface, 'review_sessions', 'review_sessions_performance_cycle_id_idx'))) {
        await queryInterface.addIndex('review_sessions', ['performance_cycle_id'], {
          name: 'review_sessions_performance_cycle_id_idx',
          transaction,
        });
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const table = await queryInterface.describeTable('review_sessions');

      if (!table.from_date) {
        await queryInterface.addColumn(
          'review_sessions',
          'from_date',
          {
            type: Sequelize.DATEONLY,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_DATE'),
          },
          { transaction }
        );
      }

      if (!table.to_date) {
        await queryInterface.addColumn(
          'review_sessions',
          'to_date',
          {
            type: Sequelize.DATEONLY,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_DATE'),
          },
          { transaction }
        );
      }

      if (table.performance_cycle_id) {
        await queryInterface.removeColumn('review_sessions', 'performance_cycle_id', {
          transaction,
        });
      }
    });
  },
};

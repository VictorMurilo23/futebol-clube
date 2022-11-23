module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matches', {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      home_team: {
        type: Sequelize.INTEGER,
        references: {
          model: 'teams',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      home_team_goals: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      away_team: {
        type: Sequelize.INTEGER,
        references: {
          model: 'teams',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      away_team_goals: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      in_progress: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('matches');
  },
};

import { BOOLEAN, INTEGER, Model } from 'sequelize';
import db from '.';
import TeamModel from './TeamModel';

class MatchModel extends Model {
  declare id: number;
  declare homeTeam: number;
  declare homeTeamGoals: number;
  declare awayTeam: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
  declare teamHome?: { teamName: string };
  declare teamAway?: { teamName: string };
}

MatchModel.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    type: INTEGER,
    primaryKey: true,
  },
  homeTeam: {
    allowNull: false,
    type: INTEGER,
    references: {
      model: 'teams',
      key: 'id',
    },
  },
  homeTeamGoals: {
    allowNull: false,
    type: INTEGER,
  },
  awayTeam: {
    allowNull: false,
    type: INTEGER,
    references: {
      model: 'teams',
      key: 'id',
    },
  },
  awayTeamGoals: {
    allowNull: false,
    type: INTEGER,
  },
  inProgress: {
    allowNull: false,
    type: BOOLEAN,
  },
}, {
  underscored: true,
  sequelize: db,
  tableName: 'matches',
  timestamps: false,
});

MatchModel.belongsTo(TeamModel, { foreignKey: 'homeTeam', as: 'teamHome' });
TeamModel.hasMany(MatchModel, { foreignKey: 'homeTeam', as: 'teamHome' });

MatchModel.belongsTo(TeamModel, { foreignKey: 'awayTeam', as: 'teamAway' });
TeamModel.hasMany(MatchModel, { foreignKey: 'awayTeam', as: 'teamAway' });

export default MatchModel;

import * as Joi from 'joi';
import ITeamService from '../interfaces/ITeamService';
import CreateTeamObj from '../types/CreateTeamObj';
import IMatchService from '../interfaces/IMatchService';
import MatchModel from '../database/models/MatchModel';
import MatchObj from '../types/MatchObj';
import TeamService from './TeamService';

export default class MatchService implements IMatchService {
  private teamService: ITeamService;

  constructor(private matchModel = MatchModel) {
    this.teamService = new TeamService();
  }

  private async filteredGetAll(boolean: boolean): Promise<MatchObj[]> {
    const matches = await this.matchModel.findAll({
      where: {
        inProgress: boolean,
      },
      include: {
        all: true,
        attributes: {
          exclude: ['id'],
        },
      },
    });
    return matches;
  }

  private async normalGetAll(): Promise<MatchObj[]> {
    const matches = await this.matchModel.findAll({
      include: {
        all: true,
        attributes: {
          exclude: ['id'],
        },
      },
    });
    return matches;
  }

  private async validateTeamsIds(homeTeam: number, awayTeam: number): Promise<void> {
    await this.teamService.getOne(homeTeam);
    await this.teamService.getOne(awayTeam);
  }

  private static validateCreateReqBody(reqBody: CreateTeamObj): CreateTeamObj {
    const schema = Joi.object({
      homeTeam: Joi.number().min(0).required(),
      awayTeam: Joi.number().min(0).required(),
      homeTeamGoals: Joi.number().min(0).required(),
      awayTeamGoals: Joi.number().min(0).required(),
    });

    const { error, value } = schema.validate(reqBody);
    if (error) {
      throw new Error('All fields must be filled');
    }

    return value;
  }

  public async getAll(inProgressBoolean?: boolean): Promise<MatchObj[]> {
    let matches: MatchObj[];
    if (inProgressBoolean === undefined) {
      matches = await this.normalGetAll();
      return matches;
    }
    matches = await this.filteredGetAll(inProgressBoolean);
    return matches;
  }

  public async create(reqBody: CreateTeamObj): Promise<MatchObj> {
    const { awayTeam, awayTeamGoals, homeTeam, homeTeamGoals } = MatchService
      .validateCreateReqBody(reqBody);
    await this.validateTeamsIds(homeTeam, awayTeam);
    const match = await this.matchModel.create(
      { awayTeam, awayTeamGoals, homeTeam, homeTeamGoals, inProgress: true },
      { returning: true },
    );
    return match;
  }
}

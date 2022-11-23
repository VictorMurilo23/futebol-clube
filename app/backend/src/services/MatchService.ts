import * as Joi from 'joi';
import UpdateMatchObj from '../types/UpdateMatchObj';
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
    if (homeTeam === awayTeam) {
      throw new Error('It is not possible to create a match with two equal teams');
    }
    try {
      await this.teamService.getOne(homeTeam);
      await this.teamService.getOne(awayTeam);
    } catch (e) {
      throw new Error('There is no team with such id!');
    }
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

  private async getOne(matchId: number): Promise<MatchObj> {
    const match = await this.matchModel.findOne({ where: { id: matchId } });
    if (match === null) throw new Error('Match not found');
    return match;
  }

  private static validateUpdateGoalsReqBody(reqBody: UpdateMatchObj): UpdateMatchObj {
    const schema = Joi.object({
      homeTeamGoals: Joi.number().min(0).required(),
      awayTeamGoals: Joi.number().min(0).required(),
    });

    const { error, value } = schema.validate(reqBody);
    if (error) {
      throw new Error('All fields must be filled');
    }

    return value;
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

  public async finishMatch(matchId: number): Promise<string> {
    await this.getOne(matchId);
    await this.matchModel.update({ inProgress: false }, { where: { id: matchId } });
    return 'Finished';
  }

  public async updateMatch(matchId: number, teamsGoals: UpdateMatchObj): Promise<string> {
    await this.getOne(matchId);
    const { awayTeamGoals, homeTeamGoals } = MatchService.validateUpdateGoalsReqBody(teamsGoals);
    await this.matchModel.update({ awayTeamGoals, homeTeamGoals }, { where: { id: matchId } });
    return 'Updated';
  }
}

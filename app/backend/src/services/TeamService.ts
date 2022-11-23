import teamObj from '../types/TeamObj';
import TeamModel from '../database/models/TeamModel';
import ITeamService from '../interfaces/ITeamService';

export default class TeamService implements ITeamService {
  constructor(private teamModel = TeamModel) {}

  public async getAll(): Promise<teamObj[]> {
    const teams = await this.teamModel.findAll();
    return teams;
  }

  public async getOne(id: number): Promise<teamObj> {
    const team = await this.teamModel.findOne({ where: { id } });
    if (team === null) throw new Error('Team not found');
    return team;
  }
}

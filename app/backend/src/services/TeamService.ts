import teamObj from '../types/TeamObj';
import TeamModel from '../database/models/TeamModel';
import ITeamService from '../interfaces/ITeamService';

export default class TeamService implements ITeamService {
  constructor(private teamModel = TeamModel) {}

  public async getAll(): Promise<teamObj[]> {
    const teams = await this.teamModel.findAll();
    return teams;
  }
}

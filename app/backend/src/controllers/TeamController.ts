import { Request, Response } from 'express';
import ITeamService from '../interfaces/ITeamService';
import TeamService from '../services/TeamService';
// import errorMessageHandler from '../utils/errorMessageHandler';

export default class TeamController {
  constructor(private teamService: ITeamService = new TeamService()) {}

  public async getAll(_req: Request, res: Response) {
    const teams = await this.teamService.getAll();
    return res.status(200).json(teams);
  }
}

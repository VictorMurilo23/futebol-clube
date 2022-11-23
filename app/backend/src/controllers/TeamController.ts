import { Request, Response } from 'express';
import ITeamService from '../interfaces/ITeamService';
import TeamService from '../services/TeamService';
import errorMessageHandler from '../utils/errorMessageHandler';

export default class TeamController {
  constructor(private teamService: ITeamService = new TeamService()) {}

  public async getAll(_req: Request, res: Response) {
    try {
      const teams = await this.teamService.getAll();
      return res.status(200).json(teams);
    } catch (e) {
      return res.status(500).json({ message: 'Unknown Error' });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const team = await this.teamService.getOne(Number(req.params.id));
      return res.status(200).json(team);
    } catch (e) {
      if (e instanceof Error) {
        const { message, status } = errorMessageHandler(e.message);
        return res.status(status).json({ message });
      }
      return res.status(500).json({ message: 'Unknown Error' });
    }
  }
}

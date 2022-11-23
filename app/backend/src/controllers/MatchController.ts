import { Request, Response } from 'express';
import IMatchService from '../interfaces/IMatchService';
import MatchService from '../services/MatchService';
// import errorMessageHandler from '../utils/errorMessageHandler';

export default class MatchController {
  constructor(private matchService: IMatchService = new MatchService()) {}

  public async getAll(_req: Request, res: Response) {
    try {
      const matches = await this.matchService.getAll();
      return res.status(200).json(matches);
    } catch (e) {
      return res.status(500).json({ message: 'Unknown Error' });
    }
  }
}

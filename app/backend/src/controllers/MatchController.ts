import { Request, Response } from 'express';
import errorMessageHandler from '../utils/errorMessageHandler';
import IMatchService from '../interfaces/IMatchService';
import MatchService from '../services/MatchService';

export default class MatchController {
  private static unknownErrorMessage = 'Unknown Error';
  constructor(private matchService: IMatchService = new MatchService()) {}

  public async getAll(req: Request, res: Response) {
    try {
      const { inProgress } = req.query;

      if (inProgress && Boolean(inProgress)) {
        const toBoolean = inProgress === 'true';
        const matches = await this.matchService.getAll(toBoolean);
        return res.status(200).json(matches);
      }

      const matches = await this.matchService.getAll();
      return res.status(200).json(matches);
    } catch (e) {
      return res.status(500).json({ message: MatchController.unknownErrorMessage });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const match = await this.matchService.createMatch(req.body);
      return res.status(201).json(match);
    } catch (e) {
      if (e instanceof Error) {
        const { message, status } = errorMessageHandler(e.message);
        return res.status(status).json({ message });
      }
      return res.status(500).json({ message: MatchController.unknownErrorMessage });
    }
  }

  public async finishMatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const message = await this.matchService.finishMatch(Number(id));
      return res.status(200).json({ message });
    } catch (e) {
      if (e instanceof Error) {
        const { message, status } = errorMessageHandler(e.message);
        return res.status(status).json({ message });
      }
      return res.status(500).json({ message: MatchController.unknownErrorMessage });
    }
  }

  public async updateMatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const message = await this.matchService.updateMatch(Number(id), req.body);
      return res.status(200).json({ message });
    } catch (e) {
      if (e instanceof Error) {
        const { message, status } = errorMessageHandler(e.message);
        return res.status(status).json({ message });
      }
      return res.status(500).json({ message: MatchController.unknownErrorMessage });
    }
  }
}

import { Request, Response } from 'express';
import ILeaderboardService from '../interfaces/ILeaderboardService';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  private static unknownErrorMessage = 'Unknown Error';
  constructor(private leaderboardService: ILeaderboardService = new LeaderboardService()) {}

  public async getHomeLeaderboard(_req: Request, res: Response) {
    try {
      const leaderboard = await this.leaderboardService.getHomeLeaderboard();
      return res.status(200).json(leaderboard);
    } catch (e) {
      return res.status(500).json({ message: LeaderboardController.unknownErrorMessage });
    }
  }

  public async getAwayLeaderboard(_req: Request, res: Response) {
    try {
      const leaderboard = await this.leaderboardService.getAwayLeaderboard();
      return res.status(200).json(leaderboard);
    } catch (e) {
      return res.status(500).json({ message: LeaderboardController.unknownErrorMessage });
    }
  }

  public async getLeaderboard(_req: Request, res: Response) {
    try {
      const leaderboard = await this.leaderboardService.getLeaderboard();
      return res.status(200).json(leaderboard);
    } catch (e) {
      return res.status(500).json({ message: LeaderboardController.unknownErrorMessage });
    }
  }
}

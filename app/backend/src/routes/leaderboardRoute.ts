import * as express from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderboardController = new LeaderboardController();

const leaderboardRoute = express.Router();

leaderboardRoute.get('/home', (req, res) => leaderboardController.getHomeLeaderboard(req, res));

leaderboardRoute.get('/away', (req, res) => leaderboardController.getAwayLeaderboard(req, res));

export default leaderboardRoute;

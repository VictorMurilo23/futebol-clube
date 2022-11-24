import LeaderboardInfo from '../types/LeaderboardInfo';

export default interface ILeaderboardService {
  getHomeLeaderboard(): Promise<LeaderboardInfo[]>,
  getAwayLeaderboard(): Promise<LeaderboardInfo[]>,
  getLeaderboard(): Promise<LeaderboardInfo[]>,
}

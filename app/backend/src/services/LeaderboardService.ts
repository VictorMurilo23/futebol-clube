import TeamGoal from '../types/TeamGoal';
import IMatchService from '../interfaces/IMatchService';
import MatchService from './MatchService';
import MatchObj from '../types/MatchObj';
import LeaderboardInfo from '../types/LeaderboardInfo';
import ILeaderboardService from '../interfaces/ILeaderboardService';

export default class LeaderboardService implements ILeaderboardService {
  private static teamLeaderboardInfo: LeaderboardInfo = {
    name: '',
    totalPoints: 0,
    totalGames: 0,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 0,
    goalsOwn: 0,
    goalsBalance: 0,
    efficiency: 0,
  };

  constructor(private matchService: IMatchService = new MatchService()) {}

  private static calculateTeamPoints(teamMatches: MatchObj[], team1: TeamGoal, team2: TeamGoal) {
    const teamInfo = { ...LeaderboardService.teamLeaderboardInfo };
    teamMatches.forEach((element: MatchObj) => {
      if (element[team1] > element[team2]) {
        teamInfo.totalVictories += 1;
        teamInfo.totalPoints += 3;
      } else if (element[team1] < element[team2]) {
        teamInfo.totalLosses += 1;
      } else {
        teamInfo.totalPoints += 1;
        teamInfo.totalDraws += 1;
      }
      teamInfo.goalsFavor += element[team1];
      teamInfo.goalsOwn += element[team2];
    });
    return teamInfo;
  }

  private static calculateTeamScore(teamMatches: MatchObj[], teamType: 'teamHome' | 'teamAway') {
    const currentTeamGoals = teamType === 'teamHome' ? 'homeTeamGoals' : 'awayTeamGoals';
    const opponentTeamGoals = teamType === 'teamHome' ? 'awayTeamGoals' : 'homeTeamGoals';
    const teamInfo = LeaderboardService
      .calculateTeamPoints(teamMatches, currentTeamGoals, opponentTeamGoals);
    teamInfo.totalGames = teamMatches.length;
    teamInfo.goalsBalance = teamInfo.goalsFavor - teamInfo.goalsOwn;
    teamInfo.efficiency = Number(((teamInfo.totalPoints / (teamInfo.totalGames * 3)) * 100)
      .toFixed(2));
    teamInfo.name = teamMatches[0][teamType].teamName || '';
    return teamInfo;
  }

  private static getLeaderboard(matches: MatchObj[], teamType: 'teamHome' | 'teamAway') {
    const teamNames = matches.map((element) => element[teamType]?.teamName);
    const teamNamesWithoutRepeat = [...new Set(teamNames)];
    const leaderboard = [];

    for (let index = 0; index < teamNamesWithoutRepeat.length; index += 1) {
      const teamMatchesArray = matches
        .filter((element) => element[teamType].teamName === teamNamesWithoutRepeat[index]);
      const teamInfo = LeaderboardService.calculateTeamScore(teamMatchesArray, teamType);
      leaderboard.push(teamInfo);
    }

    const sortedLeaderboar = LeaderboardService.sortLeaderboard(leaderboard);
    return sortedLeaderboar;
  }

  private static sortLeaderboard(leaderboard: LeaderboardInfo[]): LeaderboardInfo[] {
    const sorted = leaderboard.sort((a, b) => b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsFavor - a.goalsFavor
    || b.goalsOwn - a.goalsFavor);
    return sorted;
  }

  private static getTotalLeaderboard(home: LeaderboardInfo[], away: LeaderboardInfo[]) {
    const leaderboard = [];
    for (let index = 0; index < home.length; index += 1) {
      const teamInfo = { ...LeaderboardService.teamLeaderboardInfo };
      teamInfo.name = away[index].name;
      teamInfo.totalPoints = away[index].totalPoints + home[index].totalPoints;
      teamInfo.totalGames = away[index].totalGames + home[index].totalGames;
      teamInfo.totalVictories = away[index].totalVictories + home[index].totalVictories;
      teamInfo.totalDraws = away[index].totalDraws + home[index].totalDraws;
      teamInfo.totalLosses = away[index].totalLosses + home[index].totalLosses;
      teamInfo.goalsFavor = away[index].goalsFavor + home[index].goalsFavor;
      teamInfo.goalsOwn = away[index].goalsOwn + home[index].goalsOwn;
      teamInfo.goalsBalance = teamInfo.goalsFavor - teamInfo.goalsOwn;
      teamInfo.efficiency = Number(((teamInfo.totalPoints / (teamInfo.totalGames * 3)) * 100)
        .toFixed(2));
      leaderboard.push(teamInfo);
    }
    return leaderboard;
  }

  public async getHomeLeaderboard(): Promise<LeaderboardInfo[]> {
    const notInProgressMatches = await this.matchService.getAll(false);
    const leaderboard = LeaderboardService.getLeaderboard(notInProgressMatches, 'teamHome');
    return leaderboard;
  }

  public async getAwayLeaderboard(): Promise<LeaderboardInfo[]> {
    const notInProgressMatches = await this.matchService.getAll(false);
    const leaderboard = LeaderboardService.getLeaderboard(notInProgressMatches, 'teamAway');
    return leaderboard;
  }

  public async getLeaderboard(): Promise<LeaderboardInfo[]> {
    const sortedHome = (await this.getHomeLeaderboard())
      .sort((a, b) => a.name.localeCompare(b.name));
    const sortedAway = (await this.getAwayLeaderboard())
      .sort((a, b) => a.name.localeCompare(b.name));
    const leaderboard = LeaderboardService.getTotalLeaderboard(sortedHome, sortedAway);
    const sortedLeaderboard = LeaderboardService.sortLeaderboard(leaderboard);
    return sortedLeaderboard;
  }
}

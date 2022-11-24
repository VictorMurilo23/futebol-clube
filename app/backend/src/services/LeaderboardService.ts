import TeamGoal from '../types/TeamGoal';
import IMatchService from '../interfaces/IMatchService';
import MatchModel from '../database/models/MatchModel';
import MatchService from './MatchService';
import MatchObj from '../types/MatchObj';
import LeaderboardInfo from '../types/LeaderboardInfo';

export default class LeaderboardService {
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

  private matchService: IMatchService;
  constructor(private matchModel = MatchModel) {
    this.matchService = new MatchService();
  }

  private static changeTeamInfo(teamMatches: MatchObj[], team1: TeamGoal, team2: TeamGoal) {
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
    const currentTeamGoal = teamType === 'teamHome' ? 'homeTeamGoals' : 'awayTeamGoals';
    const opponentTeamGoal = teamType === 'teamHome' ? 'awayTeamGoals' : 'homeTeamGoals';
    const teamInfo = LeaderboardService
      .changeTeamInfo(teamMatches, currentTeamGoal, opponentTeamGoal);
    teamInfo.totalGames = teamMatches.length;
    teamInfo.goalsBalance = teamInfo.goalsFavor - teamInfo.goalsOwn;
    teamInfo.efficiency = Number(((teamInfo.totalPoints / (teamInfo.totalGames * 3)) * 100)
      .toFixed(2));
    teamInfo.name = teamMatches[0][teamType]?.teamName || '';
    return teamInfo;
  }

  private static getLeaderboard(matches: MatchObj[], teamType: 'teamHome' | 'teamAway') {
    const homeTeams = matches.map((element) => element[teamType]?.teamName);
    const teamNamesWithoutRepeat = [...new Set(homeTeams)];
    const teamsLeaderboard = [];

    for (let index = 0; index < teamNamesWithoutRepeat.length; index += 1) {
      const teamMatches = matches
        .filter((element) => element[teamType]?.teamName === teamNamesWithoutRepeat[index]);
      const teamInfo = LeaderboardService.calculateTeamScore(teamMatches, teamType);
      teamsLeaderboard.push(teamInfo);
    }

    const sortedLeaderboar = LeaderboardService.sortLeaderboard(teamsLeaderboard);
    return sortedLeaderboar;
  }

  public async getHomeLeaderboard(): Promise<LeaderboardInfo[]> {
    const matches = await this.matchService.getAll();
    const notInProgressMatches = matches.filter((element) => element.inProgress === false);
    const leaderboard = LeaderboardService.getLeaderboard(notInProgressMatches, 'teamHome');
    return leaderboard;
  }

  public async getAwayLeaderboard(): Promise<LeaderboardInfo[]> {
    const matches = await this.matchService.getAll();
    const notInProgressMatches = matches.filter((element) => element.inProgress === false);
    const leaderboard = LeaderboardService.getLeaderboard(notInProgressMatches, 'teamAway');
    return leaderboard;
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

  public async getLeaderboard(): Promise<LeaderboardInfo[]> {
    const sortedHome = (await this.getHomeLeaderboard())
      .sort((a, b) => a.name.localeCompare(b.name));
    const sortedAway = (await this.getAwayLeaderboard())
      .sort((a, b) => a.name.localeCompare(b.name));

    const leaderboard = LeaderboardService.getTotalLeaderboard(sortedHome, sortedAway);
    console.log(leaderboard);
    const sortedLeaderboard = LeaderboardService.sortLeaderboard(leaderboard);
    return sortedLeaderboard;
  }
}

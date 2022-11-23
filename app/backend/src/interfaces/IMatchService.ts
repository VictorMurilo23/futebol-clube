import CreateTeamObj from '../types/CreateTeamObj';
import MatchObj from '../types/MatchObj';

export default interface IMatchService {
  getAll(inProgressBoolean?: boolean): Promise<MatchObj[]>;
  create(obj: CreateTeamObj): Promise<MatchObj>;
  finishMatch(matchId: number): Promise<string>
}

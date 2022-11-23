import MatchObj from '../types/MatchObj';

export default interface IMatchService {
  getAll(inProgressBoolean?: boolean): Promise<MatchObj[]>;
}

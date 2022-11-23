import MatchObj from '../types/MatchObj';

export default interface IMatchService {
  getAll(): Promise<MatchObj[]>;
}

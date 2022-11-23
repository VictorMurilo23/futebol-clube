import IMatchService from '../interfaces/IMatchService';
import MatchModel from '../database/models/MatchModel';
import MatchObj from '../types/MatchObj';

export default class MatchService implements IMatchService {
  constructor(private matchModel = MatchModel) {}

  public async getAll(): Promise<MatchObj[]> {
    const teams = await this.matchModel.findAll({ include: {
      all: true,
      attributes: {
        exclude: ['id'],
      },
    } });
    return teams;
  }
}

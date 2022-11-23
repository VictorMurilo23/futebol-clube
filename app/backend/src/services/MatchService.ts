import IMatchService from '../interfaces/IMatchService';
import MatchModel from '../database/models/MatchModel';
import MatchObj from '../types/MatchObj';

export default class MatchService implements IMatchService {
  constructor(private matchModel = MatchModel) {}

  private async filteredGetAll(boolean: boolean): Promise<MatchObj[]> {
    const teams = await this.matchModel.findAll({
      where: {
        inProgress: boolean,
      },
      include: {
        all: true,
        attributes: {
          exclude: ['id'],
        },
      },
    });
    return teams;
  }

  private async normalGetAll(): Promise<MatchObj[]> {
    const teams = await this.matchModel.findAll({
      include: {
        all: true,
        attributes: {
          exclude: ['id'],
        },
      },
    });
    return teams;
  }

  public async getAll(inProgressBoolean?: boolean): Promise<MatchObj[]> {
    let matches: MatchObj[];
    if (inProgressBoolean === undefined) {
      matches = await this.normalGetAll();
      return matches;
    }
    matches = await this.filteredGetAll(inProgressBoolean);
    return matches;
  }
}

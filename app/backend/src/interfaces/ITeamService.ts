import teamObj from '../types/TeamObj';

export default interface ITeamService {
  getAll(): Promise<teamObj[]>;
  getOne(id: number): Promise<teamObj>;
}

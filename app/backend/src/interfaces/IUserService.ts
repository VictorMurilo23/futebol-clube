import UserLoginBody from '../types/UserLoginBody';

export default interface IUserService {
  login(reqBody: UserLoginBody): Promise<string>,
}

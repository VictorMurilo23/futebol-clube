import UserLoginBody from '../types/UserLoginBody';

type roleObj = {
  role: string
};

export default interface IUserService {
  login(reqBody: UserLoginBody): Promise<string>,
  validateRole(token: string): Promise<roleObj>
}

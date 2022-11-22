import { compare } from 'bcryptjs';
import createToken from '../utils/token';
import UserInfo from '../types/UserInfo';
import UserModel from '../database/models/UserModel';
import UserLoginBody from '../types/UserLoginBody';
import IUserService from '../interfaces/IUserService';

export default class UserService implements IUserService {
  constructor(private userModel = UserModel) {}

  private static async validateLogin(dbInfo: UserInfo | null, reqBodyInfo: UserLoginBody) {
    if (dbInfo === null) {
      throw new Error('Incorrect email or password');
    }
    const match = await compare(reqBodyInfo.password, dbInfo.password);
    if (!match) {
      throw new Error('Incorrect email or password');
    }
    return { ...dbInfo, password: '_' };
  }

  public async login(reqBody: UserLoginBody): Promise<string> {
    const dbInfo: UserInfo | null = await this.userModel
      .findOne({ where: { email: reqBody.email }, attributes: { exclude: ['id'] },
      });

    const userInfo: UserInfo = await UserService.validateLogin(dbInfo, reqBody);
    const token = createToken(userInfo);
    return token;
  }
}

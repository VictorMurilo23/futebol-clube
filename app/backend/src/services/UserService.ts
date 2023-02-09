import { compare } from 'bcryptjs';
import * as Joi from 'joi';
import { createToken } from '../utils/token';
import UserInfo from '../types/UserInfo';
import UserModel from '../database/models/UserModel';
import UserLoginBody from '../types/UserLoginBody';
import IUserService from '../interfaces/IUserService';

export default class UserService implements IUserService {
  static incorrectEmailOrPasswordMessage = 'Incorrect email or password';
  constructor(private userModel = UserModel) {}

  private static validateReqBody(reqBody: UserLoginBody): UserLoginBody {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(7).required(),
    });

    const { error, value } = schema.validate(reqBody);
    if (error) {
      throw new Error('All fields must be filled');
    }

    return value;
  }

  private static async validatePassword(
    dbUserInfo: UserInfo,
    reqBodyInfo: UserLoginBody,
  ) {
    const comparePasswords = await compare(
      reqBodyInfo.password,
      dbUserInfo.password,
    );
    if (comparePasswords === false) {
      throw new Error(UserService.incorrectEmailOrPasswordMessage);
    }
    return { ...dbUserInfo, password: '_' };
  }

  public async login(reqBody: UserLoginBody): Promise<string> {
    const validReqBody = UserService.validateReqBody(reqBody);
    const dbUserInfo: UserInfo | null = await this.userModel.findOne({
      where: { email: validReqBody.email },
      attributes: { exclude: ['id'] },
    });

    if (dbUserInfo === null) { throw new Error(UserService.incorrectEmailOrPasswordMessage); }

    const userInfo: UserInfo = await UserService.validatePassword(
      dbUserInfo,
      validReqBody,
    );
    const token = createToken(userInfo);
    return token;
  }

  public async validateRole(email: string): Promise<{ role: string }> {
    const dbInfo: UserInfo | null = await this.userModel.findOne({
      where: { email },
    });
    if (dbInfo === null) {
      throw new Error(UserService.incorrectEmailOrPasswordMessage);
    }
    return { role: dbInfo.role };
  }
}

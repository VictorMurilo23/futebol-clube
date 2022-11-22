import { compare } from 'bcryptjs';
import * as Joi from 'joi';
import createToken from '../utils/token';
import UserInfo from '../types/UserInfo';
import UserModel from '../database/models/UserModel';
import UserLoginBody from '../types/UserLoginBody';
import IUserService from '../interfaces/IUserService';

export default class UserService implements IUserService {
  constructor(private userModel = UserModel) {}

  private static validateReqBody(reqBody: UserLoginBody): UserLoginBody {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error, value } = schema.validate(reqBody);
    if (error) {
      throw new Error('All fields must be filled');
    }

    return value;
  }

  private static async validateLogin(dbInfo: UserInfo | null, reqBodyInfo: UserLoginBody) {
    if (dbInfo === null || await compare(reqBodyInfo.password, dbInfo.password) === false) {
      throw new Error('Incorrect email or password');
    }
    return { ...dbInfo, password: '_' };
  }

  public async login(reqBody: UserLoginBody): Promise<string> {
    const validUserInfo = UserService.validateReqBody(reqBody);
    const dbInfo: UserInfo | null = await this.userModel
      .findOne({ where: { email: validUserInfo.email }, attributes: { exclude: ['id'] },
      });

    const userInfo: UserInfo = await UserService.validateLogin(dbInfo, validUserInfo);
    const token = createToken(userInfo);
    return token;
  }
}
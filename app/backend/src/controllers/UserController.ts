import { Request, Response } from 'express';
import errorMessageHandler from '../utils/errorMessageHandler';
import IUserService from '../interfaces/IUserService';
import UserService from '../services/UserService';

export default class UserController {
  constructor(private userService: IUserService = new UserService()) {}

  public async login(req: Request, res: Response) {
    try {
      const token = await this.userService.login(req.body);
      return res.status(200).json({ token });
    } catch (e: unknown) {
      if (e instanceof Error) {
        const { message, status } = errorMessageHandler(e.message);
        return res.status(status).json({ message });
      }
      return res.status(500).json({ message: 'Unknown Error' });
    }
  }

  public async validate(req: Request, res: Response) {
    try {
      const token = req.headers.authorization;
      if (!token) throw new Error('Insert a token');

      const { role } = await this.userService.validate(token);
      return res.status(200).json({ role });
    } catch (e: unknown) {
      if (e instanceof Error) {
        const { message, status } = errorMessageHandler(e.message);
        return res.status(status).json({ message });
      }
      return res.status(500).json({ message: 'Unknown Error' });
    }
  }
}

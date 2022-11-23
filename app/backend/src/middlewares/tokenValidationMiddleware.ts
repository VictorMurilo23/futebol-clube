import { NextFunction, Request, Response } from 'express';
import errorMessageHandler from '../utils/errorMessageHandler';
import { validateToken } from '../utils/token';

export default function tokenValidationMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error('Token must be a valid token');
    const tokenInfo = validateToken(authorization);
    req.headers.from = tokenInfo.email;
    next();
  } catch (e: unknown) {
    if (e instanceof Error) {
      const { message, status } = errorMessageHandler(e.message);
      return res.status(status).json({ message });
    }
    return res.status(500).json({ message: 'UnknownError' });
  }
}

import { JwtPayload, sign, verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import UserInfo from '../types/UserInfo';
import JwtData from '../types/JwtData';

dotenv.config();
const secret: string = process.env.JWT_SECRET || 'jwt_secret';

export function createToken(data: UserInfo) {
  const token = sign({ data }, secret, {
    expiresIn: '12h',
    algorithm: 'HS256',
  });

  return token;
}

export function validateToken(token: string): JwtData {
  try {
    const decoded = verify(token, secret) as JwtPayload;
    return decoded.data;
  } catch (e) {
    throw new Error('Token must be a valid token');
  }
}

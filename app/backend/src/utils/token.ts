import { sign, verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import UserInfo from '../types/UserInfo';

dotenv.config();
const secret: string = process.env.JWT_SECRET || 'jwt_secret';

export function createToken(data: UserInfo) {
  const token = sign({ data }, secret, {
    expiresIn: '12h',
    algorithm: 'HS256',
  });

  return token;
}

export function validateToken(token: string) {
  try {
    const info = verify(token, secret);
    return info;
  } catch (e) {
    throw new Error('Expired or invalid token');
  }
}

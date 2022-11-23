import { JwtPayload } from 'jsonwebtoken';
import JwtData from '../types/JwtData';

export default interface ITokenInfo extends JwtPayload {
  data: JwtData
}

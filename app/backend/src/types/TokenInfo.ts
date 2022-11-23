// import { JwtPayload } from 'jsonwebtoken';

type dataObj = {
  email: string,
  username: string,
  role: string,
  password: string
};

type TokenInfo = {
  data: dataObj,
  iat: number,
  exp: number
};

export default TokenInfo;

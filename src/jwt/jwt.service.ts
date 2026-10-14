import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { IJwt } from './jwt.interface';

@Injectable()
export class JwtService {
  static OPTION_JWT: any;
  constructor(@Inject('JWT') private readonly params: IJwt) {}
  generateToken(payload: { id: number }) {
    return jwt.sign(payload, this.params.JWT_SECRET, { expiresIn: '7d' });
  }
  verifyToken(token: string): jwt.JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.params.JWT_SECRET);
      return typeof decoded === 'object' ? decoded : null;
    } catch {
      return null;
    }
  }
  findToken(authorization) {
    console.log(authorization);
    // const [bearer, token] = authorization.split(' ');
    // if (!token) {
    // 	return false;
    // }
    return authorization;
  }
}

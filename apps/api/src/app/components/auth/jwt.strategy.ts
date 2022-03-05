import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWT_MODULE_CONFIG } from './constants';
import { User } from '../../models/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_MODULE_CONFIG.secret,
    });
  }

  public async validate(payload: any): Promise<Partial<User>> {
    return { id: payload.sub, name: payload.username };
  }
}
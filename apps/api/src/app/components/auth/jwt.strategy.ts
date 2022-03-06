import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../../models/user.entity';
import { UserService } from '../user/user.service';
import { JWT_MODULE_CONFIG } from '../../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_MODULE_CONFIG.secret,
    });
  }

  public async validate(payload: any): Promise<Partial<User>> {
    const user = await this.userService.getUserById(payload.sub);
    return user;
  }
}

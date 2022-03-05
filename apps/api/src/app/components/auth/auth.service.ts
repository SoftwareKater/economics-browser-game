import { Injectable } from '@nestjs/common';
import { User } from '../../models/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService
  ) {}

  public async login(email: string, password: string): Promise<string> {
    const passwordHash = password; // @todo hash password
    const user = await this.validateUser(email, passwordHash);
    if (!user) {
      throw Error("Wrong username or password.");
    }
    return this.getToken(user);
  }

  public async validateUser(
    email: string,
    passwordHash: string
  ): Promise<Partial<User> | undefined> {
    const user = await this.usersService.getUserByEmail(email);
    if (user && user.passwordHash === passwordHash) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return undefined;
  }

  async getToken(user: Partial<User>): Promise<string> {
    const payload = { username: user.name, sub: user.id };
    const token = this.jwtService.sign(payload);
    return token;
  }
}

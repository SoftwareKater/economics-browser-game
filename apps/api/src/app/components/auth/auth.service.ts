import { Injectable } from '@nestjs/common';
import { User } from '../../models/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService) {}

  public async validateUser(email: string, passwordHash: string): Promise<Partial<User> | undefined> {
    const user = await this.usersService.getUserByEmail(email);
    if (user && user.passwordHash === passwordHash) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return undefined;
  }
}
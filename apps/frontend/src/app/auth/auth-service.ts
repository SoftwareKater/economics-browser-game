import { UserToken } from './user-token.interface';

export class AuthService {
  /**
   * @todo call api login route
   * @param email user email
   * @param password user password
   * @returns UserToken
   */
  public login(email: string, password: string): UserToken {
    return {
      id: '123',
      name: 'Ich',
    };
  }
}

import { JWT_SESSION_STORAGE_KEY } from './constants';
import { UserToken } from './user-token.interface';

export default class TokenStore {
  public getToken(): UserToken | undefined {
    const tokenString = sessionStorage.getItem(JWT_SESSION_STORAGE_KEY);
    if (!tokenString) {
      return undefined;
    }
    const userToken = JSON.parse(tokenString);
    return userToken;
  }

  public saveToken(userToken: UserToken): void {
    sessionStorage.setItem(JWT_SESSION_STORAGE_KEY, JSON.stringify(userToken));
  }

  public removeToken(): void {
    if (!this.getToken()) {
      // not logged in
      return;
    }
    sessionStorage.removeItem(JWT_SESSION_STORAGE_KEY);
  }
}

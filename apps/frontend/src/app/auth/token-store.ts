import { JWT_SESSION_STORAGE_KEY } from './constants';

export default class TokenStore {
  public getToken(): string | undefined {
    const tokenString = sessionStorage.getItem(JWT_SESSION_STORAGE_KEY);
    if (!tokenString) {
      return undefined;
    }
    const userToken = JSON.parse(tokenString);
    return userToken;
  }

  public saveToken(userToken: string): void {
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

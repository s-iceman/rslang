import { INewUserRegistration, IUserSignIn } from '../views/loginPage/types';
export class LoginModel {
  private baseUrl;

  constructor() {
    this.baseUrl = 'http://localhost:8082';
  }

  static async createUser(user: INewUserRegistration, urlForRequest: string) {
    const rawResponse = await fetch(urlForRequest, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    return rawResponse.json();
  }

  static async loginUser(user: IUserSignIn, urlForRequest: string) {
    const rawResponse = await fetch(urlForRequest, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    return rawResponse.json();
  }
}

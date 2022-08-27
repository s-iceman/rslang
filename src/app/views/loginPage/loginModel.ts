import { INewUserRegistration, IUserSignIn } from './types';
export class LoginModel {
  private baseUrl;
  private urlSigin;
  private urlUserCreate;

  constructor() {
    this.baseUrl = 'http://localhost:8082';
    this.urlSigin = 'http://localhost:8082/users';
    this.urlUserCreate = 'http://localhost:8082/signin';
  }

  public async createUser(user: INewUserRegistration) {
    const rawResponse = await fetch(this.urlUserCreate, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    //rawResponse.status === 200 403
    return rawResponse.json();
  }

  public async loginUser(user: IUserSignIn) {
    const rawResponse = await fetch(this.urlSigin, {
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

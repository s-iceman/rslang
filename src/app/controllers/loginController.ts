import { LoginModel } from '../models/loginModel';
import { LoginView } from '../views/loginPage/login';
import { IAutentificatedUser, INewUserRegistration, IUserSignIn } from '../views/loginPage/types';

export class LoginController {
  private baseUrl: string;

  private urlSignin: string;

  private urlUserCreate: string;

  constructor() {
    this.baseUrl = 'http://localhost:8082';
    this.urlUserCreate = `${this.baseUrl}/users`;
    this.urlSignin = `${this.baseUrl}/signin`;
  }

  public newUserRegistrate(registrNewUser: INewUserRegistration) {
    LoginModel.createUser(registrNewUser, this.urlUserCreate)
      .then((): void => {
        this.showPopUpWindow('Вы зарегистрированы', true);
      })
      .then((): void => {
        this.userSignIn(<IUserSignIn>registrNewUser);
      })
      .catch((): void => {
        this.showPopUpWindow('Пользователь с таким email уже существует');
      });
  }

  public userSignIn(signInUser: IUserSignIn) {
    LoginModel.loginUser(signInUser, this.urlSignin)
      .then((response: IAutentificatedUser) => {
        this.userAfterSignIn(response);
      })
      .catch((response: Error) => {
        if (response.message === 'Failed to fetch') {
          this.showPopUpWindow('Нету подключения к серверу');
        } else {
          this.showPopUpWindow('Incorrect e-mail or password');
        }
      });
  }

  public userAfterSignIn(autorizedUser: IAutentificatedUser) {
    const loginText = document.querySelector('.login') as HTMLElement;
    loginText.innerHTML = autorizedUser.name;
    this.showPopUpWindow('Вы авторизированы', true);
    autorizedUser.isAuth = true;
    localStorage.setItem('user', JSON.stringify(autorizedUser));
  }

  public getUserInputValueSignIn(email: string, password: string) {
    const signinUser: IUserSignIn = { email, password };
    return signinUser;
  }

  public getUserInputValueRegistrate(email: string, password: string, name: string) {
    const registrNewUser: INewUserRegistration = { email, password, name };
    return registrNewUser;
  }

  public autUserFormMetod(event: Event): void {
    event.preventDefault(); // to do view
    const userSignIn = document.getElementById('signin') as HTMLInputElement;
    const userSignUp = document.getElementById('signup') as HTMLInputElement;
    const emailForm = document.getElementById('email') as HTMLInputElement;
    const passwordForm = document.getElementById('pass') as HTMLInputElement;
    const name = document.getElementById('name') as HTMLInputElement;

    if (userSignIn.checked) {
      this.userSignIn(this.getUserInputValueSignIn(emailForm.value, passwordForm.value));
    }
    if (userSignUp.checked) {
      if (name.value.toString() !== '') {
        this.newUserRegistrate(this.getUserInputValueRegistrate(emailForm.value, passwordForm.value, name.value));
      } else {
        this.showPopUpWindow('Вы не ввели свое имя');
      }
    }
  }

  private showPopUpWindow(text: string, reload?: boolean) {
    const root = document.querySelector('.autorization');
    root?.append(LoginView.popUpWindowAut(text, reload));
  }

  public logOut(event: Event): void {
    event.preventDefault();
    localStorage.removeItem('user');
    window.location.reload();
  }
}

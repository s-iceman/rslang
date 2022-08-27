import { loginUser, createUser } from './loginApi';
import { IAutentificatedUser, INewUserRegistration, IUserSignIn } from './types';

export class LoginController {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:8082';
  }

  public newUserRegistrate(registrNewUser: INewUserRegistration) {
    createUser(registrNewUser)
      .then((response) => {
        alert('Вы зарегистрированны'), this.userAfterSignIn(response);
      })
      .catch(() => alert('Такой пользователь уже есть'));
  }

  public userSignIn(signInUser: IUserSignIn) {
    loginUser(signInUser)
      .then((response) => {
        this.userAfterSignIn(response);
      })
      .catch((response) => {
        if (response.message === 'Failed to fetch') {
          alert('Нету подключения к серверу');
        } else {
          console.log(response), 'Incorrect e-mail or password';
        }
      });
  }

  public userAfterSignIn(autorizedUser: IAutentificatedUser) {
    const loginText = document.querySelector('.login') as HTMLElement;
    loginText.innerHTML = autorizedUser.name;
    alert('Вы авторизированы');
    localStorage.setItem('user', JSON.stringify(autorizedUser));
    window.location.href = '#';
  }

  public getUserInputValueSignIn(email: string, password: string) {
    let signinUser: IUserSignIn = { email, password };
    return signinUser;
  }

  public getUserInputValueRegistrate(email: string, password: string, name: string) {
    let registrNewUser: INewUserRegistration = { email, password, name };
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
      //если входит пользователь
      this.userSignIn(this.getUserInputValueSignIn(emailForm.value, passwordForm.value));
    }
    if (userSignUp.checked) {
      // если регистрируется новый
      if (name.value.toString() !== '') {
        this.newUserRegistrate(this.getUserInputValueRegistrate(emailForm.value, passwordForm.value, name.value));
      } else alert('Введите имя');
    }
  }
}

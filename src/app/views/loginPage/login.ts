import { ViewPath } from '../../common/constants';
import { IView } from '../interfaces';
import { View } from '../view';
import './login.css';
import { LoginController } from '../../controllers/loginController';
import { IAutentificatedUser } from './types';
export class LoginView extends View implements IView {
  private logincontroller: LoginController;

  constructor() {
    super('/login');
    this.logincontroller = new LoginController();
  }

  render(): void {
    this.root.innerHTML = '';
    const user: IAutentificatedUser | null = localStorage.getItem('user')
      ? <IAutentificatedUser>JSON.parse(localStorage.getItem('user') || '')
      : null;
    if (user === null) {
      this.root.append(...this.createAutorizationForm());
      this.root.addEventListener(
        'submit',
        (e: SubmitEvent) => {
          // to do
          this.logincontroller.autUserFormMetod(e);
        },
        true
      );
    } else {
      this.root.append(...this.createAutorizedForm(user.name));
      this.root.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('go-to-main-button')) this.logincontroller.logOut(e);
      });
    }
  }

  static getPath(): string {
    return ViewPath.LOGIN; //путь
  }

  private createAutorizationForm(): ReadonlyArray<HTMLElement> {
    const autorizationForm = `
              <form class="autorization__form">
                <input checked="" id="signin" name="action" type="radio" value="signin">
                <label class="aut__label" for="signin">Вход</label>
                <input id="signup" name="action" type="radio" value="signup">
                <label class="aut__label" for="signup">Регистрация</label>
                <div id="wrapper__aut">
                  <div id="arrow"></div>
                  <input id="email" placeholder="Email" type="email" required>
                  <input id="pass" placeholder="Password" type="password" required pattern="[0-9]{8,16}" title="Введите от 8 до 16 цифр">
                  <input id="name" placeholder="Your name" type="text">
                </div>
                <button class="btn-login" type="submit">
                  <span>
                    <br>
                    Вход
                    <br>
                    Зарегистрироваться
                  </span>
                </button>
              </form>
          `;
    const autorization = document.createElement('div');
    autorization.classList.add('autorization');
    autorization.innerHTML = autorizationForm;
    return [autorization];
  }

  public createAutorizedForm(name: string): ReadonlyArray<HTMLElement> {
    const afterAutForm = `
            <div class="after-aut">
              <div class="after-aut-message">
              <p>Вы вошли в систему</p>
              <span>Пользователь: ${name}</span>
                <div class="go-to-main-button">
                  Выход
                </div>
              </div>
            </div>
          `;
    const messageAfterAut = document.createElement('div');
    messageAfterAut.classList.add('after-autarization');
    messageAfterAut.innerHTML = afterAutForm;
    return [messageAfterAut];
  }

  public popUpWindowAut() {
    const popUp = `

    `;
    return popUp;
  }
}

import { ViewPath } from '../../common/constants';
import { IView, MenuBtn } from '../interfaces';
import { View } from '../view';
import './login.css';
import { LoginController } from './loginController';
export class LoginView extends View implements IView {
  render(): void {
    this.root.innerHTML = '';
    this.root.append(...this.createAutorizationForm());
    this.root.addEventListener('submit', (e) => {
      // to do
      let loginController = new LoginController();
      loginController.autUserFormMetod(e);
    });
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
}

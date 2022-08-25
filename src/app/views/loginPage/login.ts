import { ViewPath } from '../../common/constants';
import { IView, MenuBtn } from '../interfaces';
import { View } from '../view';
import './login.css';
import { createUser, loginUser } from './loginApi';
import { IUserSignIn, INewUserRegistration, IAutentificatedUser } from './types';

export class LoginView extends View implements IView {
    private btn: MenuBtn;

    render(): void {
      this.root.innerHTML = '';
      this.root.append(...this.createAutorizationForm());
      this.root.addEventListener('submit',(this.autUserFormMetod));
    }
  
    static getPath(): string {
      return ViewPath.LOGIN;   //путь 
    }
  
    private createAutorizationForm(): ReadonlyArray<HTMLElement> {
      const btn: MenuBtn = document.createElement('a');
      btn.setAttribute('style','color:red')
      btn.innerText = 'go back';
      btn.id = 'login';
      btn.href = '/login'; //ссылка временная, удалить потом 
      this.btn = btn;

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
      

      const autorization = document.createElement('div')
      autorization.classList.add('autorization');
      autorization.innerHTML = autorizationForm;
      autorization.appendChild(btn);
      return [autorization];
    }
  
    protected getBtnToChangePage(): MenuBtn {
      return this.btn;
    }


    private autUserFormMetod (event:Event):void {
      event.preventDefault();
      const userSignIn = document.getElementById('signin') as HTMLInputElement;
      const userSignUp = document.getElementById('signup') as HTMLInputElement;
      const emailForm =document.getElementById('email') as HTMLInputElement;
      const passwordForm =document.getElementById('pass')as HTMLInputElement;
      const name =document.getElementById('name')as HTMLInputElement;
      const loginText = document.querySelector('.login') as HTMLElement;

      if(userSignIn.checked){
        let signinUser:IUserSignIn = {email:'',password:''};
        let autorizedUser:IAutentificatedUser = {name:''};
        signinUser!.email = emailForm.value;
        signinUser!.password = passwordForm.value;
        loginUser(signinUser!)
          .then(response =>{autorizedUser = response;console.log(autorizedUser)})
          .then(()=>alert('Вы авторизированны'))
          .then(()=>{
            loginText.innerHTML = autorizedUser.name;
            localStorage.setItem('user',JSON.stringify(autorizedUser));
            window.location.href='#';
          })
          .catch(()=>console.log('Не правильные данные'));
        }

        if(userSignUp.checked){
          let registrNewUser:INewUserRegistration = {email:'',password:'',name:''};
          if(name.value.toString() !==''){
          console.log(emailForm.value,passwordForm.value);
          registrNewUser!.email = emailForm.value;
          registrNewUser!.password = passwordForm.value;
          registrNewUser!.name = name.value;
          createUser(registrNewUser!)
          .then(()=>{alert('Вы зарегистрированны');localStorage.setItem('User',JSON.stringify(registrNewUser));window.location.href='#';})
          .catch(()=>alert('Такой пользователь уже есть'));
          }else (alert('Введите имя'))
        }
    }

}

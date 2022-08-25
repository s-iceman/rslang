import { IView, MenuBtn } from '../interfaces';
import { View } from '../view';
import './login.css';
import { IUserSignIn, INewUserRegistration, IAutentificatedUser } from './types';

export class Login extends View implements IView {
    private btn: MenuBtn;
    private urlLocalUsersCreate ='http://localhost:8082/users';
    private urlLocalSignIn = 'http://localhost:8082/signin';

    render(): void {
      this.root.innerHTML = '';
      this.root.append(...this.createAutorizationForm());
    }
  
    static getPath(): string {
      return '/login';   //путь 
    }
  
    private createAutorizationForm(): ReadonlyArray<HTMLElement> {
      const btn: MenuBtn = document.createElement('a');
      btn.setAttribute('style','color:red')
      btn.innerText = 'go back';
      btn.id = 'login';
      btn.href = '/'; //ссылка временная, удалить потом 
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
      this.renderTorefractorCode();
      return [autorization];
    }
  
    protected getBtnToChangePage(): MenuBtn {
      return this.btn;
    }




  renderTorefractorCode() {
    



    let signinUser:IUserSignIn ={
      email:'',
      password:'',
    }
    let registrNewUser:INewUserRegistration={
      email:'',
      password:'',
      name:'',
    };
    let autorizedUser:IAutentificatedUser;
    let errorEmail:string = 'incorect email';

    const createUser = async (user:INewUserRegistration) => {
            const rawResponse = await fetch(this.urlLocalUsersCreate, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(user)
            });
           const content = await rawResponse.json();
          console.log(content);
    };

   const loginUser = async (user:IUserSignIn) => {
    const rawResponse = await fetch(this.urlLocalSignIn, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    return rawResponse.json();
  }

    document.body.addEventListener('submit',(submitFormHandler));

    function submitFormHandler(event:Event){
      event.preventDefault();
      const userSignIn = document.getElementById('signin') as HTMLInputElement;
      const userSignUp = document.getElementById('signup') as HTMLInputElement;
      const emailForm =document.getElementById('email') as HTMLInputElement;
      const passwordForm =document.getElementById('pass')as HTMLInputElement;
      const name =document.getElementById('name')as HTMLInputElement;
      const loginText = document.querySelector('.login') as HTMLElement;
      //name.required = false;
      if(userSignIn.checked){
      console.log(emailForm.value,passwordForm.value);
      signinUser.email = emailForm.value;
      signinUser.password = passwordForm.value;
      loginUser(signinUser).then(response =>{
        autorizedUser = response;
        console.log(autorizedUser.token)})
        .then(()=>alert('вы авторизированны'))
        .then(()=>{
       // App.renderNewPage('main-page');
        loginText!.innerHTML = autorizedUser.name;
          localStorage.setItem('User',JSON.stringify(autorizedUser));
          window.location.href='#';
        
        })
        .catch(()=>console.log('не правильные данные'));
      }
      if(userSignUp.checked){
        //name.value===''?name.required=true:name.required=false;
        if(name.value.toString() !==''){
        console.log(emailForm.value,passwordForm.value);
        registrNewUser.email = emailForm.value;
        registrNewUser.password = passwordForm.value;
        registrNewUser.name = name.value;
        createUser(registrNewUser)
        .then(()=>{alert('Вы зарегистрированны');localStorage.setItem('User',JSON.stringify(registrNewUser));window.location.href='#';})
        .catch(()=>alert('Такой пользователь уже есть'));
        }else (alert('Введите имя'))
      }
    }

    // this.container.innerHTML=html;
    // return this.container;
  }

}

export default Login;
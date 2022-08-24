//import Page from '../../core/templates/page';
//import App from '../app';
import { IView, MenuBtn } from '../interfaces';
import { innerText } from '../mainPage/mainPageHtml';
import { View } from '../view';
import './login.css';

export class Login extends View implements IView {
    private btn: MenuBtn;
  
    render(): void {
      this.root.innerHTML = '';
      this.root.append(...this.createContent());
    }
  
    static getPath(): string {
      return '/login';
    }
  
    private createContent(): ReadonlyArray<HTMLElement> {
      //const hero = document.createElement('section')
      
  
  
      const btn: MenuBtn = document.createElement('a');
      btn.innerText = 'login';
      btn.id = 'login';
      btn.href = '/login';
      this.btn = btn;
  
      const text: HTMLDivElement = document.createElement('div');
      text.textContent = 'login';
  
  
      return [btn];
    }
  
    protected getBtnToChangePage(): MenuBtn {
      return this.btn;
    }
  }



// class Login extends View {
//   static TextObject = {
//     MainTitle: 'Login',
//   };

//   constructor() {
//     super();
//   }

//   render() {
//     const html = `
//     <div class="autorization">
//         <form class="autorization__form">
//           <input checked="" id="signin" name="action" type="radio" value="signin">
//           <label class="aut__label" for="signin">Вход</label>
//           <input id="signup" name="action" type="radio" value="signup">
//           <label class="aut__label" for="signup">Регистрация</label>
//           <div id="wrapper__aut">
//             <div id="arrow"></div>
//             <input id="email" placeholder="Email" type="text">
//             <input id="pass" placeholder="Password" type="password">
//             <input id="name" placeholder="Your name" type="password">
//           </div>
//           <button class="btn-login" type="submit">
//             <span>
//               <br>
//               Вход
//               <br>
//               Зарегистрироваться
//             </span>
//           </button>
//         </form>
//     </div>
//     `;

//     type INewUserRegistration= {
//       name:string;
//       email:string;
//       password:string;
//     }

//     type IUserSignIn= {
//       email:string;
//       password:string;
//     }

//     type IAutentificatedUser= {
//       message:string;
//       name:string;
//       refreshToken:string;
//       token:string;
//       userId:string;
//     }

//     const urlLocalUsersCreate ='http://localhost:8082/users';
//     const urlLocalSignIn = 'http://localhost:8082/signin';

//     let signinUser:IUserSignIn ={
//       email:'',
//       password:'',
//     }
//     let registrNewUser:INewUserRegistration={
//       email:'',
//       password:'',
//       name:'',
//     };
//     let autorizedUser:IAutentificatedUser;
//     let errorEmail:string = 'incorect email';

//     const createUser = async (user:INewUserRegistration) => {
//             const rawResponse = await fetch(urlLocalUsersCreate, {
//               method: 'POST',
//               headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//               },
//               body: JSON.stringify(user)
//             });
//            const content = await rawResponse.json();
//           console.log(content);
//     };

//    const loginUser = async (user:IUserSignIn) => {
//     const rawResponse = await fetch(urlLocalSignIn, {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(user)
//     });

//     return rawResponse.json();
//   }

//     document.body.addEventListener('submit',(submitFormHandler));

//     function submitFormHandler(event:Event){
//       event.preventDefault();
//       const userSignIn = document.getElementById('signin') as HTMLInputElement;
//       const userSignUp = document.getElementById('signup') as HTMLInputElement;
//       const emailForm =document.getElementById('email') as HTMLInputElement;
//       const passwordForm =document.getElementById('pass')as HTMLInputElement;
//       const name =document.getElementById('name')as HTMLInputElement;
//       const loginText = document.querySelector('.login') as HTMLElement;
//       if(userSignIn.checked){
//       console.log(emailForm.value,passwordForm.value);
//       signinUser.email = emailForm.value;
//       signinUser.password = passwordForm.value;
//       loginUser(signinUser).then(response =>{
//         autorizedUser = response;
//         console.log(autorizedUser.token)})
//         .then(()=>alert('вы авторизированны'))
//         .then(()=>{
//         App.renderNewPage('main-page');
//         loginText!.innerHTML = autorizedUser.name;
//           localStorage.setItem('token',autorizedUser.token);
//           localStorage.setItem('id',autorizedUser.userId);
//           localStorage.setItem('name',autorizedUser.name);
//           window.location.href='';
        
//         })
//         .catch(()=>console.log('не правильные данные'));
//       }
//       if(userSignUp.checked){
//         console.log(emailForm.value,passwordForm.value);
//         registrNewUser.email = emailForm.value;
//         registrNewUser.password = passwordForm.value;
//         registrNewUser.name = name.value;
//         createUser(registrNewUser)
//         .then(()=>alert('вы зарегистрированны'))
//         .catch(()=>console.log('не правильные данные'));
//       }
//     }

//     this.container.innerHTML=html;
//     return this.container;
//   }
// }

export default Login;
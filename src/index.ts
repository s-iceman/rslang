import { AppController } from '../src/app/controllers/appController';
import { IAppController } from '../src/app/controllers/interfaces';
import './scss/main.css';

const app: IAppController = new AppController();
app.start();

// void (async function () {
//   const model = new AppModel('http://localhost:8383');
//   const user = { email: 'test@mail.ru', password: '12345678' };

//   const data = await model.signIn(user);

//   if (data) {
//     const userInfo = {
//       isAuth: true,
//       name: `${data.name || ''}`,
//       token: `${data.token || ''}`,
//       userId: `${data.userId || ''}`,
//     };
//     localStorage.setItem('user', JSON.stringify(userInfo));
//   }
// })();

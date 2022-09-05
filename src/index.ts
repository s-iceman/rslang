import { AppController } from '../src/app/controllers/appController';
import { IAppController } from '../src/app/controllers/interfaces';
import './scss/main.scss';

const app: IAppController = new AppController();
app.start();

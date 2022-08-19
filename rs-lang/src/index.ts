import { AppController } from './app/controllers/appController';
import { IAppController } from './app/controllers/interfaces';

const app: IAppController = new AppController();
app.start();

import { AppController } from './app/controllers/appController';
import { IAppController } from './app/controllers/interfaces';
import { TextBookController } from './app/controllers/textbookController';
import './scss/main.css';

const app: IAppController = new AppController(new TextBookController());
app.start();

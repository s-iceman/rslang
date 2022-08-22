import './assets/scss/style.scss';
import AppControler from './controllers/AppControler';

// const app = new GetWordList();
// void app.getWords();
// console.log('app.getWords(): ', app.getWords());
// console.log('app.getWords: ', app);
const app = new AppControler();
void app.init();

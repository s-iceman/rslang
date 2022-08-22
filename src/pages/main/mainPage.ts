import Page from '../../core/templates/page';
import { innerText } from './mainPageHtml';
import './mainPage.css';

class MainPage extends Page {
  static TextObject = {
    MainTitle: 'Main Page',
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const hero = document.createElement('section')
    hero.classList.add('hero');
    hero.innerHTML = `
    <div class="hero__container">
    <h2>SPEAKLAND</h2>
    <p>Лучшее приложение для изучения английского языка</p>
    </div>
    `
    this.container.append(hero)
    const containerMain = document.createElement('div');
    containerMain.classList.add('container')
    containerMain.innerHTML = innerText();
    this.container.append(containerMain)
    return this.container;
  }
}

export default MainPage;

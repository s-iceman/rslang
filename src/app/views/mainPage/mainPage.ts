import { IView, MenuBtn } from '../interfaces';
import { View } from '../view';
import './mainPage.css';
import {innerText} from './mainPageHtml'

export class MainPage extends View implements IView {
  private btn: MenuBtn;

  render(): void {
    this.root.innerHTML = '';
    this.root.append(...this.createContent());
  }

  static getPath(): string {
    return '/';
  }

  private createContent(): ReadonlyArray<HTMLElement> {
    const hero = document.createElement('section')
    hero.classList.add('hero');
    hero.setAttribute('style','background-image: url(../assets/img/slide/slide-1.jpg)');
    hero.innerHTML = `
    <div class="hero__container";>
    <h2>SPEAKLAND</h2>
    <p>Лучшее приложение для изучения английского языка онлайн</p>
    </div>
    `
    this.root.append(hero)
    const containerMain = document.createElement('div');
    containerMain.classList.add('container')
    containerMain.innerHTML = innerText();
    this.root.append(containerMain)

    const btn: MenuBtn = document.createElement('a');
    btn.innerText = 'Textbook';
    btn.id = 'go-to-textbook';
    btn.href = '/textbook';
    this.btn = btn;

    const text: HTMLDivElement = document.createElement('div');
    text.textContent = 'MAIN PAGE';


    return [hero,containerMain,btn];
  }

  protected getBtnToChangePage(): MenuBtn {
    return this.btn;
  }
}

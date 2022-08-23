import AppControler from '../controllers/AppControler';
import { IApiWords } from '../models/interfaces';
import CreateMarkup from './common/createMarkup';
import Words from './words/Words';

export default class AppView {
  controler: AppControler | null;

  constructor(private baseUrl: string, private parentNode = document.body) {
    this.baseUrl = baseUrl;
    this.parentNode = parentNode;
    this.controler = null;
  }

  renderHeader() {
    const headerMarkup = `
      <div class="header__logo">
        <a class="header__link" href="/"><h1 class="header__title">RS Lang</h1></a>
      </div>
    `;

    const header = new CreateMarkup(this.parentNode, 'header', 'header');
    const headerWrap = new CreateMarkup(header.node, 'div', 'header__wrap', headerMarkup);
    const wordButtons = new CreateMarkup(headerWrap.node, 'div', 'auth__buttons');

    const btnAuth = new CreateMarkup(wordButtons.node, 'button', 'button btn-auth', 'Войти');
    btnAuth.node.addEventListener('click', () => {
      (btnAuth.node as HTMLButtonElement).disabled = true;
      void this.controler?.userSign();
    });
  }

  renderFooter() {
    const footerMarkup = `
      <div class="footer__wrap">
        <div class="footer__copyright">©<span>2022 RSLang</span></div>
        <div class="footer__teams">
          <span class="icon github-icon"></span>
          <a target="_blank" href="https://github.com/s-iceman">Oksana Zavadskaya</a>
          <a target="_blank" href="https://github.com/darap1">Andrei Darapiyevich</a>
          <a target="_blank" href="https://github.com/Boffin-ux">Boris Nizameev</a>
        </div>
        <a target="_blank" href="https://rs.school/js/" class="link rs-link"></a>
      </div>
    `;
    new CreateMarkup(this.parentNode, 'footer', 'footer', footerMarkup);
  }

  addWordListWrap() {
    new CreateMarkup(this.parentNode, 'div', 'dictionary');
  }

  renderWordList(wordsData: IApiWords[]) {
    const parentNode = <HTMLElement>document.querySelector('.dictionary');
    parentNode.innerHTML = '';
    const words = new Words(this.baseUrl, parentNode);
    wordsData.map((wordsItem) => words.addCardWord(wordsItem));
  }

  init() {
    this.controler = new AppControler();

    this.renderHeader();
    this.addWordListWrap();
    this.renderFooter();
  }
}

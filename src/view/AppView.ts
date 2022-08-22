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
      btnAuth.node.innerHTML = 'Выйти';
      document.querySelector('.textbook')!.innerHTML = '';
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

  renderWordList(data: IApiWords[]) {
    const textbook = new CreateMarkup(this.parentNode, 'section', 'textbook');
    const words = new Words(this.baseUrl, data, textbook.node);
    return words.render();
  }

  init(data: IApiWords[]) {
    this.controler = new AppControler();
    this.renderHeader();
    this.renderWordList(data);
    this.renderFooter();
  }
}

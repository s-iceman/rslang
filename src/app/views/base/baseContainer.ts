import Header from '../header/header';
import Footer from '../footer/footer';

export class BaseContainer {
  private body: HTMLElement;

  private root: HTMLElement;

  private header: Header;

  private footer: Footer;

  constructor() {
    this.body = <HTMLElement>document.querySelector('body');
    this.body.innerHTML = '';
    this.header = new Header('header', 'header');
    this.footer = new Footer('footer', 'footer');

    this.root = document.createElement('div');
    this.root.classList.add('root');

    this.body.append(this.header.render());
    this.body.append(this.root);
    this.body.append(this.footer.render());
  }
}

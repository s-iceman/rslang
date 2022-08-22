import Page from '../../core/templates/page';
import MainPage from '../main/mainPage';
import SettingsPage from '../settings';
import StatisticsPage from '../statistics';
import Header from '../../core/components/header/header';
import ErrorPage, { ErrorTypes } from '../error';
import Login from '../login/login-page';
import Footer from '../../core/components/footer/footer';

export const enum PageIds {
  MainPage = 'main-page',
  BookPage = 'book-page',
  StatisticsPage = 'statistics-page',
  LoginPage = 'login-page'
}

class App {
  private static container: HTMLElement = document.body;
  private static defaultPageId: string = 'current-page';
  private header: Header;
  private footer: Footer;

  static renderNewPage(idPage: string) {
    const currentPageHTML = document.querySelector(`#${App.defaultPageId}`);
    if (currentPageHTML) {
      currentPageHTML.remove();
    }
    let page: Page | null = null;

    if (idPage === PageIds.MainPage) {
      page = new MainPage(idPage);
    } else if (idPage === PageIds.BookPage) {
      page = new SettingsPage(idPage);
    } else if (idPage === PageIds.StatisticsPage) {
      page = new StatisticsPage(idPage);
    } else if (idPage === PageIds.LoginPage) {
      page = new Login(idPage);
    }else {
      page = new ErrorPage(idPage, ErrorTypes.Error_404);
    }

    if (page) {
      const pageHTML = page.render();
      pageHTML.id = App.defaultPageId;
      App.container.insertBefore(pageHTML,App.container.lastChild);
    }
  }

  private enableRouteChange() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      App.renderNewPage(hash);
    });
  }

  constructor() {
    this.header = new Header('header','header');
    this.footer = new Footer('footer','footer')
  }

  run() {
    App.container.append(this.header.render());
    App.container.append(this.footer.render());
    App.renderNewPage('main-page');
    this.enableRouteChange();
  }
}

// Main, Settings, Statistics

export default App;
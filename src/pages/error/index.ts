import Page from '../../core/templates/page';
import  './error.css';

export const enum ErrorTypes {
  Error_404 = 404,
}

class ErrorPage extends Page {
  private errorType: ErrorTypes | string;

  static TextObject: { [prop: string]: string } = {
    '404': 'Error! The page was not found.'
  };

  constructor(id: string, errorType: ErrorTypes | string) {
    super(id);
    this.errorType = errorType;
  }

  render() {
    const title = this.createHeaderTitle(ErrorPage.TextObject[this.errorType]);
    const errorWraper = document.createElement('div');
    errorWraper.classList.add('errorWraper');
    errorWraper.appendChild(title);
    this.container.append(errorWraper);
    return this.container;
  }
}

export default ErrorPage;
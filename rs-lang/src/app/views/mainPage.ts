import { IView, MenuBtn } from './interfaces';
import { View } from './view';

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
    const btn: MenuBtn = document.createElement('a');
    btn.innerText = 'Textbook';
    btn.id = 'go-to-textbook';
    btn.href = '/textbook';
    this.btn = btn;

    const text: HTMLDivElement = document.createElement('div');
    text.textContent = 'MAIN PAGE';

    return [btn, text];
  }

  protected getBtnToChangePage(): MenuBtn {
    return this.btn;
  }
}

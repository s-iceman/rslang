import { IView } from './../interfaces';
import { View } from '../view';
import { MenuBtnType, MenuBtn } from '../types';

export class TextbookView extends View implements IView {
  private btn: MenuBtn;

  render(): void {
    this.root.innerHTML = '';
    this.root.append(...this.createContent());
  }

  static getPath(): string {
    return '/textbook';
  }

  private createContent(): ReadonlyArray<HTMLElement> {
    const btn: MenuBtnType = document.createElement('a');
    btn.innerText = 'Main page';
    btn.id = 'go-to-main';
    btn.href = '/';
    this.btn = btn;

    const text: HTMLDivElement = document.createElement('div');
    text.textContent = 'TEXTBOOK';

    return [btn, text];
  }

  protected getBtnToChangePage(): MenuBtn {
    return this.btn;
  }
}

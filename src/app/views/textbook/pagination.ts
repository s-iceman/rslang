import { PaginBtnType } from '../constants';
import { IPagination, PaginType } from '../interfaces';
import { TOTAL_PAGES, START_PAGE } from './constants';

const DELIMITER = '-';

export class Pagination implements IPagination {
  private current: number;

  private start: number;

  private end: number;

  private btnBlocks: Array<HTMLElement>;

  constructor() {
    this.start = START_PAGE;
    this.end = TOTAL_PAGES - 1;
    this.current = this.start;
    this.btnBlocks = [];
  }

  static getBtnId(elem: HTMLElement): number {
    return Number(elem.id.slice(elem.id.lastIndexOf(DELIMITER) + 1));
  }

  getCurrentPage(): number {
    return this.current;
  }

  create(activeBtnClass: string, btnIdPref?: PaginType): HTMLDivElement {
    const parent: HTMLDivElement = document.createElement('div');
    parent.classList.add('pagination');
    parent.id = String(btnIdPref) || '';
    parent.append(
      this.createBtn(PaginBtnType.First, '<<', btnIdPref),
      this.createBtn(PaginBtnType.Prev, '<', btnIdPref),
      this.createBtn(PaginBtnType.Current, '', btnIdPref, activeBtnClass),
      this.createBtn(PaginBtnType.Next, '>', btnIdPref),
      this.createBtn(PaginBtnType.Last, '>>', btnIdPref)
    );
    this.btnBlocks.push(parent);
    this.hideBlock(true);
    return parent;
  }

  update(selectedBtn: PaginBtnType, classNames?: Array<string>, page?: number): void {
    this.updateIndeces(selectedBtn, page);
    const btns: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.pagination__item');
    Array.from(btns).forEach((e) => {
      const btn: HTMLButtonElement = e;
      const btnType: PaginBtnType = Pagination.getBtnId(e);
      if (btnType === PaginBtnType.Current) {
        btn.textContent = String(this.current + 1);
        if (classNames) {
          const oldClasses = btn.classList;
          oldClasses.forEach((c) => btn.classList.remove(c));
          btn.classList.add('pagination__item', 'active', ...classNames);
        }
        return;
      }
      if (this.isDisabled(btnType)) {
        btn.classList.add('disabled');
        btn.disabled = true;
      } else {
        btn.disabled = false;
        btn.classList.remove('disabled');
      }
    });
  }

  hideBlock(isHide: boolean): void {
    const style = isHide ? 'hidden' : 'visible';
    this.btnBlocks.forEach((e) => (e.style.visibility = style));
  }

  private updateIndeces(btnType: PaginBtnType, page?: number): void {
    switch (btnType) {
      case PaginBtnType.First:
        this.current = 0;
        break;
      case PaginBtnType.Prev:
        if (this.current > START_PAGE) {
          this.current -= 1;
        }
        break;
      case PaginBtnType.Next:
        if (this.current < this.end) {
          this.current += 1;
        }
        break;
      case PaginBtnType.Last:
        this.current = this.end;
        break;
      case PaginBtnType.Current:
        this.current = page || START_PAGE;
        break;
      default:
        break;
    }
  }

  private createBtn(btnType: PaginBtnType, label: string, btnIdPref?: PaginType, activeBtnClass?: string): HTMLElement {
    const btn: HTMLButtonElement = document.createElement('button');
    btn.classList.add('pagination__item');
    if (this.isDisabled(btnType)) {
      btn.classList.add('disabled');
      btn.disabled = true;
    } else if (btnType == PaginBtnType.Current) {
      btn.classList.add('active');
      btn.classList.add(`${activeBtnClass || ''}`);
    }
    const prefix = btnIdPref ? btnIdPref + DELIMITER : '';
    btn.id = `${prefix || ''}${btnType}`;
    btn.innerHTML = label;
    return btn;
  }

  private isDisabled(btnType: PaginBtnType): boolean {
    switch (btnType) {
      case PaginBtnType.First:
      case PaginBtnType.Prev:
        return this.start === this.current;
      case PaginBtnType.Next:
      case PaginBtnType.Last:
        return this.end === this.current;
      default:
        return false;
    }
  }
}

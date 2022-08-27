import { PaginBtnType } from '../constants';
import { IPagination, PaginType } from '../interfaces';
import { TOTAL_PAGES, START_PAGE } from './constants';

const DELIMITER = '-';

export class Pagination implements IPagination {
  private current: number;

  private start: number;

  private end: number;

  constructor(current?: number) {
    this.start = START_PAGE;
    this.end = TOTAL_PAGES;
    this.current = current || this.start;
  }

  static getBtnId(elem: HTMLElement): number {
    return Number(elem.id.slice(elem.id.lastIndexOf(DELIMITER) + 1));
  }

  getCurrentPage(): number {
    return this.current;
  }

  create(activeBtnClass: string, btnIdPref?: PaginType, current = START_PAGE): HTMLDivElement {
    this.current = current;

    const parent: HTMLDivElement = document.createElement('div');
    parent.classList.add('pagination');
    parent.append(
      this.createBtn(PaginBtnType.First, '<<', btnIdPref),
      this.createBtn(PaginBtnType.Prev, '<', btnIdPref),
      this.createBtn(PaginBtnType.Current, this.current.toString(), btnIdPref, activeBtnClass),
      this.createBtn(PaginBtnType.Next, '>', btnIdPref),
      this.createBtn(PaginBtnType.Last, '>>', btnIdPref)
    );
    return parent;
  }

  update(selectedBtn: PaginBtnType): void {
    this.updateIndeces(selectedBtn);
    const btns: NodeListOf<HTMLElement> = document.querySelectorAll('.pagination__item');
    Array.from(btns).forEach((e) => {
      const btn: HTMLElement = e;
      const btnType = Pagination.getBtnId(e);
      if (btnType === PaginBtnType.Current) {
        btn.textContent = String(this.getCurrentPage());
        return;
      }
      if (this.isDisabled(btnType)) {
        btn.classList.add('disabled');
      } else {
        btn.classList.remove('disabled');
      }
    });
  }

  updateActiveBtn(classNames: Array<string>): void {
    const btns: NodeListOf<HTMLElement> = document.querySelectorAll('.pagination__item');
    Array.from(btns)
      .filter((e) => Pagination.getBtnId(e) === PaginBtnType.Current)
      .forEach((e) => {
        const btn: HTMLElement = e;
        const oldClasses = btn.classList;
        oldClasses.forEach((c) => btn.classList.remove(c));
        btn.classList.add('pagination__item', 'active', ...classNames);
      });
  }

  private updateIndeces(btnType: PaginBtnType): void {
    switch (btnType) {
      case PaginBtnType.First:
        this.current = 1;
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
      default:
        break;
    }
  }

  private createBtn(btnType: PaginBtnType, label: string, btnIdPref?: PaginType, activeBtnClass?: string): HTMLElement {
    const btn: HTMLElement = document.createElement('span');
    btn.classList.add('pagination__item');
    if (this.isDisabled(btnType)) {
      btn.classList.add('disabled');
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

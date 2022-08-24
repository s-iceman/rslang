import { PaginBtnType } from '../constants';
import { IPagination } from '../interfaces';
import { TOTAL_PAGES, START_PAGE } from './constants';

export class Pagination implements IPagination {
  private current: number;

  private start: number;

  private end: number;

  constructor(current?: number) {
    this.start = START_PAGE;
    this.end = TOTAL_PAGES;
    this.current = current || this.start;
  }

  getCurrentPage(): number {
    return this.current;
  }

  create(current = START_PAGE): HTMLDivElement {
    this.current = current;

    const parent: HTMLDivElement = document.createElement('div');
    parent.classList.add('pagination');
    parent.append(
      this.createBtn(PaginBtnType.First, '&laquo;&laquo;'),
      this.createBtn(PaginBtnType.Prev, '&laquo;'),
      this.createBtn(PaginBtnType.Current, this.current.toString()),
      this.createBtn(PaginBtnType.Next, '&raquo;'),
      this.createBtn(PaginBtnType.Last, '&raquo;&raquo;')
    );
    return parent;
  }

  update(selectedBtn: PaginBtnType): void {
    this.updateIndeces(selectedBtn);
    const btns: NodeListOf<HTMLElement> = document.querySelectorAll('.pagination__item');
    Array.from(btns).forEach((e) => {
      const btn: HTMLElement = e;
      const btnType: number = +btn.id;
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

  private createBtn(btnType: PaginBtnType, label: string): HTMLElement {
    const btn: HTMLElement = document.createElement('span');
    btn.classList.add('pagination__item');
    if (this.isDisabled(btnType)) {
      btn.classList.add('disabled');
    } else if (btnType == PaginBtnType.Current) {
      btn.classList.add('active');
    }
    btn.id = String(btnType);
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

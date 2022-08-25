import { ViewPath } from '../../common/constants';
import { IView, MenuBtnType, MenuBtn, UnitKeys, IPagination } from './../interfaces';
import { View } from '../view';
import { UnitLabels, PaginBtnType } from '../constants';
import { COUNT_WORDS_ON_PAGE } from './constants';
import { createCard } from './word';
import { SelectUnitFn } from './../../controllers/types';
import { Pagination } from './pagination';

export class TextBookView extends View implements IView {
  private unitsNav: HTMLDivElement | undefined;

  private cardsBlock: HTMLDivElement | undefined;

  private pagination: IPagination;

  constructor() {
    super();
    this.unitsNav = undefined;
    this.cardsBlock = undefined;
    this.pagination = new Pagination();
  }

  static getPath(): string {
    return ViewPath.TEXTBOOK;
  }

  render(): void {
    this.root.innerHTML = '';
    this.root.append(...this.createContent());
  }

  bindUnitListeners(handler: SelectUnitFn): void {
    this.unitsNav?.addEventListener('click', (event) => {
      if (!event.target) {
        return;
      }
      const targetElem = <HTMLElement>event.target;
      if (!targetElem.classList.contains('textbook-nav__btn')) {
        return;
      }
      this.markSelected(targetElem);
      handler(targetElem.id);
    });
  }

  bindChangePageListeners(): void {
    const elem = <HTMLElement>document.querySelector('.pagination');
    elem?.addEventListener('click', (event) => {
      if (!event.target) {
        return;
      }
      const targetElem = <HTMLElement>event.target;
      if (!targetElem.classList.contains('pagination__item')) {
        return;
      }
      this.pagination.update(Number(targetElem.id) as PaginBtnType);
    });
  }

  updateCards(unitName: string): void {
    if (!this.cardsBlock) {
      return;
    }
    this.cardsBlock.innerHTML = '';
    this.cardsBlock.innerHTML = this.createCards(unitName);

    const navBtn: HTMLElement | null = document.getElementById(unitName);
    if (navBtn) {
      this.markSelected(navBtn);
    }
  }

  private createCardsBlock(unitName: string): HTMLElement {
    const parent: HTMLDivElement = document.createElement('div');
    parent.classList.add('dictionary');
    parent.innerHTML = this.createCards(unitName);
    this.cardsBlock = parent;
    return parent;
  }

  private createCards(className: string): string {
    const cards: Array<string> = [];
    for (let i = 0; i < COUNT_WORDS_ON_PAGE; i += 1) {
      cards.push(createCard(className));
    }
    return cards.join('\n');
  }

  private createContent(): ReadonlyArray<HTMLElement> {
    const container: HTMLDivElement = document.createElement('div');
    container.append(this.createUnitsNav(), this.createCardsBlock('beginners'));
    container.append(this.pagination.create());

    return [container];
  }

  private createUnitsNav(): HTMLDivElement {
    const btns: ReadonlyArray<string> = Object.keys(UnitLabels).map((e) => this.createUnitNavBtn(e));
    const parent: HTMLDivElement = document.createElement('div');
    parent.classList.add('textbook-nav');
    parent.innerHTML = btns.join('\n');
    this.unitsNav = parent;
    return parent;
  }

  private createUnitNavBtn(unitId: string): string {
    const key = UnitLabels[unitId as UnitKeys];
    return `
      <div class="textbook-nav__btn ${key}" id="${key}">
        ${unitId}
      </div>
    `;
  }

  private markSelected(elem: HTMLElement): void {
    const elems = this.unitsNav?.children;
    if (!elems || elems.length === 0) {
      return;
    }

    Array.from(elems).forEach((e) => {
      const element = <HTMLElement>e;
      element.classList.remove('active');
    });
    elem.classList.add('active');
  }
}

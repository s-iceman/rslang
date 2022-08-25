import { ITextBookView, MenuBtnType, MenuBtn, UnitKeys, IPagination } from '../interfaces';
import { View } from '../view';
import { UnitLabels, PaginBtnType } from '../constants';
import { Pagination } from './pagination';
import Words from './word';
import { IApiWords } from '../../models/interfaces';
import { ITextBookController } from '../../controllers/interfaces';
import { MAX_GROUP_WORDS } from './constants';

export class TextBookView extends View implements ITextBookView {
  private btn: MenuBtn;

  private unitsNav: HTMLDivElement | undefined;

  private cardsBlock: HTMLDivElement | undefined;

  private pagination: IPagination;

  private ctrl: ITextBookController | null;

  constructor(baseUrl: string) {
    super(baseUrl);
    this.unitsNav = undefined;
    this.cardsBlock = undefined;
    this.pagination = new Pagination();
    this.ctrl = null;
  }

  setController(ctrl: ITextBookController): void {
    this.ctrl = ctrl;
  }

  static getPath(): string {
    return '/textbook';
  }

  render(): void {
    this.root.innerHTML = '';
    this.root.append(...this.createContent());
    this.unitsNav?.addEventListener('click', (event) => {
      this.changeUnit(event);
    });
    this.addChangePageListeners();
  }

  private changeUnit(event: Event): void {
    if (!event.target) {
      return;
    }
    const targetElem = <HTMLElement>event.target;
    if (!targetElem.classList.contains('textbook-nav__btn')) {
      return;
    }
    this.markSelected(targetElem);
    this.ctrl?.selectUnit(targetElem.id).catch((err) => console.debug(err));
  }

  private addChangePageListeners(): void {
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
      if (this.ctrl) {
        this.ctrl.changeUnitPage(this.pagination.getCurrentPage() - 1).catch((err) => console.debug(err));
      }
    });
  }

  updateCards(unitName: string, words: IApiWords[], group: number): void {
    const isHardUnit = group === MAX_GROUP_WORDS;

    if (!this.cardsBlock) {
      return;
    }
    this.cardsBlock.innerHTML = '';
    const test = this.createCards(this.cardsBlock, unitName, words, isHardUnit);
    console.log('test: ', test);

    const navBtn: HTMLElement | null = document.getElementById(unitName);
    if (navBtn) {
      this.markSelected(navBtn);
    }
  }

  private createCardsBlock(unitName: string, words: IApiWords[]): HTMLElement {
    const parent: HTMLDivElement = document.createElement('div');
    parent.classList.add('dictionary');
    // this.createCards(parent, unitName, words);
    this.cardsBlock = parent;
    return parent;
  }

  private createCards(parent: HTMLElement, className: string, wordsData: IApiWords[], isHardUnit = false): void {
    if (!this.ctrl) {
      return;
    }
    const words = new Words(this.baseUrl, this.ctrl, parent);
    console.log('words: ', words);
    wordsData.map((wordsItem) => words.addCardWord(wordsItem, isHardUnit));
  }

  private createContent(): ReadonlyArray<HTMLElement> {
    const menu: HTMLElement = this.createMenu();

    const container: HTMLDivElement = document.createElement('div');
    container.append(this.createUnitsNav(), this.createCardsBlock('beginners', []));
    container.append(this.pagination.create());

    return [menu, container];
  }

  protected getBtnToChangePage(): MenuBtn {
    return this.btn;
  }

  private createMenu(): HTMLElement {
    const btn: MenuBtnType = document.createElement('a');
    btn.classList.add('go-to-btn');
    btn.innerText = 'Main page';
    btn.id = 'go-to-main';
    btn.href = '/';
    this.btn = btn;
    return btn;
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

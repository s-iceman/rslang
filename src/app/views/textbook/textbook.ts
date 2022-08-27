import { ViewPath } from '../../common/constants';
import { ITextBookView, IPagination, PaginType } from '../interfaces';
import { View } from '../view';
import { UnitLabels, PaginBtnType } from '../constants';
import { Pagination } from './pagination';
import Words from './word';
import { IApiWords } from '../../models/interfaces';
import { ITextBookController } from '../../controllers/interfaces';
import { MAX_GROUP_WORDS } from './constants';
import { UnitLevels } from '../../controllers/constants';

const USER_UNITS = [String(UnitLevels.Hard)];

export class TextBookView extends View implements ITextBookView {
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
    return ViewPath.TEXTBOOK;
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
    const elems = document.querySelectorAll('.pagination');
    elems.forEach((elem) => {
      elem.addEventListener('click', (event) => {
        if (!event.target) {
          return;
        }
        const targetElem = <HTMLElement>event.target;
        if (!targetElem.classList.contains('pagination__item')) {
          return;
        }
        this.pagination.update(Pagination.getBtnId(targetElem) as PaginBtnType);
        if (this.ctrl) {
          this.ctrl.changeUnitPage(this.pagination.getCurrentPage() - 1).catch((err) => console.debug(err));
        }
      });
    });
  }

  updateCards(unitName: string, words: IApiWords[]): void {
    const group = this.ctrl?.getUnit();
    const isHardUnit = group === MAX_GROUP_WORDS;

    if (!this.cardsBlock) {
      return;
    }
    this.cardsBlock.innerHTML = '';
    this.createCards(this.cardsBlock, words, isHardUnit);

    const navBtn: HTMLElement | null = document.getElementById(unitName);
    if (navBtn) {
      this.markSelected(navBtn);
    }
    this.pagination.updateActiveBtn([this.getActiveUnitName()]);
  }

  private createCardsBlock(words: IApiWords[]): HTMLElement {
    const parent: HTMLDivElement = document.createElement('div');
    parent.classList.add('dictionary');
    this.createCards(parent, words);
    this.cardsBlock = parent;
    return parent;
  }

  private createCards(parent: HTMLElement, wordsData: IApiWords[], isHardUnit = false): void {
    if (!this.ctrl) {
      return;
    }
    const words = new Words(this.baseUrl, this.ctrl, parent);
    wordsData.map((wordsItem) => words.addCardWord(wordsItem, isHardUnit));
  }

  private createContent(): ReadonlyArray<HTMLElement> {
    const container: HTMLDivElement = document.createElement('div');
    container.className = 'container textbook';
    container.append(this.createUnitsNav());
    container.append(this.pagination.create(this.getActiveUnitName(), PaginType.TOP));
    container.append(this.createCardsBlock([]));
    container.append(this.pagination.create(this.getActiveUnitName(), PaginType.BOTTOM));

    return [container];
  }

  private createUnitsNav(): HTMLDivElement {
    const btns: ReadonlyArray<string> = this.getAvailableUnits().map((e) => this.createUnitNavBtn(e));
    const parent: HTMLDivElement = document.createElement('div');
    parent.classList.add('textbook-nav');
    parent.innerHTML = btns.join('\n');
    this.unitsNav = parent;
    return parent;
  }

  private createUnitNavBtn(unitId: UnitLevels): string {
    const key = UnitLabels[unitId];
    return `
      <div class="textbook-nav__btn ${key}" id="${key}">
        ${UnitLevels[unitId]}
      </div>
    `;
  }

  private getAvailableUnits(): UnitLevels[] {
    if (this.ctrl?.isAuth()) {
      return Object.keys(UnitLevels).filter((k) => k in UnitLabels) as [];
    }
    return Object.keys(UnitLevels).filter((k) => k in UnitLabels && !USER_UNITS.includes(k)) as [];
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

  private getActiveUnitName(): string {
    const unitLevel = this.ctrl?.getUnit() || UnitLevels.A1;
    return UnitLabels[unitLevel];
  }
}

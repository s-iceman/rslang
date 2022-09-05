import { UnitLevels, USER_UNITS } from '../../../controllers/constants';
import { IStartPage } from './../intefaces';

class StartPage implements IStartPage {
  private startBtn: HTMLButtonElement | undefined;

  private content: HTMLElement;

  constructor() {
    this.startBtn = undefined;
    this.content = this.createContent();
  }

  getContent(): HTMLElement {
    return this.content;
  }

  addControllsBlock(isShowLevels: boolean): void {
    const parent: HTMLDivElement = document.createElement('div');
    parent.className = 'instruction__controls';
    if (isShowLevels) {
      parent.append(this.createUnitBlock());
    }
    parent.append(this.createButton());
    this.content.append(parent);
  }

  getButton(): HTMLButtonElement | undefined {
    return this.startBtn;
  }

  getSelectedUnit(): UnitLevels | undefined {
    const select = document.getElementById('units');
    if (select) {
      const elem: HTMLSelectElement = <HTMLSelectElement>select;
      return Number(elem.options[elem.selectedIndex].value) as UnitLevels;
    }
    return undefined;
  }

  protected fillDescription(): string {
    return '';
  }

  protected getTitle(): string {
    return '';
  }

  private createContent(): HTMLElement {
    const parent: HTMLDivElement = document.createElement('div');
    parent.className = 'instruction wrapper';
    parent.append(this.createHeader());
    parent.append(this.createDescription());
    return parent;
  }

  private createHeader(): HTMLElement {
    const parent: HTMLElement = document.createElement('h2');
    parent.textContent = this.getTitle();
    return parent;
  }

  private createDescription(): HTMLDivElement {
    const parent: HTMLDivElement = document.createElement('div');
    parent.className = 'instruction__description';
    parent.innerHTML = this.fillDescription();
    return parent;
  }

  private createUnitBlock(): HTMLElement {
    const parent: HTMLElement = document.createElement('div');
    parent.classList.add('level');

    const form: HTMLFormElement = document.createElement('form');
    const select = document.createElement('select');
    select.name = 'units';
    select.id = 'units';

    for (const unitId of Object.keys(UnitLevels).filter((k) => parseInt(k) >= 0 && !USER_UNITS.includes(k))) {
      const option: HTMLOptionElement = document.createElement('option');
      option.value = unitId;
      option.text = `${UnitLevels[unitId as keyof typeof UnitLevels]}`;
      select.append(option);
    }
    form.append(select);

    const label: HTMLLabelElement = document.createElement('label');
    label.innerHTML = 'Уровень:';
    label.htmlFor = 'units';

    parent.append(label, form);
    return parent;
  }

  private createButton(): HTMLButtonElement {
    const btn: HTMLButtonElement = document.createElement('button');
    btn.className = 'button game-card__btn';
    btn.textContent = 'Играть';
    this.startBtn = btn;
    return btn;
  }
}

class SprintStartPage extends StartPage {
  getTitle(): string {
    return 'СПРИНТ';
  }

  protected fillDescription(): string {
    return `
      <div class="ways-control">
        <span>Выберите, соответствует ли перевод предложенному слову.</span>
        <ul class="ways-control__options">
          <li>Используйте мышь</li>
          <li>Используйте клавиши "влево" и "вправо"</li>
        </ul>
      </div>
    `;
  }
}

class VoiceCallStartPage extends StartPage {
  getTitle(): string {
    return 'АУДИОВЫЗОВ';
  }

  protected fillDescription(): string {
    return `
      <div class="ways-control">
        <span>Прослушайте слово и выберите его правильный перевод.</span>
        <ul class="ways-control__options">
          <li>Используйте мышь</li>
          <li>Усложните себе игру и используйте цифры на клавиатуре от 1 до 5 для правильных ответов</li>
        </ul>
      </div>
    `;
  }
}

export { SprintStartPage, VoiceCallStartPage };

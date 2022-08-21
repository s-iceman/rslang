import { ViewOrNotInit } from '../views/interfaces';
import { TextBookView } from '../views/textbook/textbook';
import { UnitLevels } from './constants';
import { ITextBookController } from './interfaces';

export class TextBookController implements ITextBookController {
  private activeUnit: UnitLevels;

  private textBookView: ViewOrNotInit;

  constructor() {
    this.activeUnit = UnitLevels.A1;
    this.textBookView = null;
  }

  getUnit(): UnitLevels {
    return this.activeUnit;
  }

  setView(view: ViewOrNotInit): void {
    if (view instanceof TextBookView) {
      this.textBookView = view;
      this.addListeners();

      const unitName: string = window.localStorage.getItem('unit') || 'beginners';
      this.textBookView?.updateCards?.(unitName);
    } else {
      this.textBookView = null;
    }
  }

  private addListeners(): void {
    if (!this.textBookView) {
      return;
    }
    this.textBookView.bindUnitListeners?.(this.selectUnit.bind(this));
    this.textBookView.bindChangePageListeners?.();
  }

  private selectUnit(unitName: string): void {
    console.log(unitName);
    this.textBookView?.updateCards?.(unitName);
    window.localStorage.setItem('unit', unitName);
  }
}

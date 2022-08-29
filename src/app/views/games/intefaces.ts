import { UnitLevels } from '../../controllers/constants';

interface IStartPage {
  addControllsBlock(isShowLevels: boolean): void;
  getContent(): HTMLElement;
  getButton(): HTMLButtonElement | undefined;
  getSelectedUnit(): UnitLevels | undefined;
}

export { IStartPage };

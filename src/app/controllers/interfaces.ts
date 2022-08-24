import { ViewOrNotInit } from '../views/interfaces';
import { UnitLevels } from './constants';

interface IAppController {
  start(): void;
}

interface ITextBookController {
  getUnit(): UnitLevels;
  setView(view: ViewOrNotInit): void;
}

interface IRouter {
  process(newPath?: string): ViewOrNotInit;
}

export { IAppController, IRouter, ITextBookController };

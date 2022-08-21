import { IView } from '../views/interfaces';

interface IAppController {
  start(): void;
}

interface IRouter {
  process(newPaht?: string): IView | undefined;
}

export { IAppController, IRouter };

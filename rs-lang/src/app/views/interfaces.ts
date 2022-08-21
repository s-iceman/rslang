import { ChangePageFn } from '../controllers/types';

interface IView {
  render(): void;
  bindChangePage(handler: ChangePageFn): void;
}

interface IViewConstructor {
  new (): IView;
  getPath(): string;
}

export { IView, IViewConstructor };

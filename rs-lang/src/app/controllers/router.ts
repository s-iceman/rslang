import { IViewConstructor, IView } from '../views/interfaces';
import { MainPage } from '../views/mainPage';
import { TextbookView } from '../views/textbook/textbook';

type MyType = Map<string, IViewConstructor>;

export class Router {
  private routes: MyType;

  constructor() {
    this.routes = this.initRoutes();
  }

  process(newPath?: string): IView | undefined {
    let path = '';
    if (newPath) {
      path = newPath;
      window.history.pushState({}, newPath, newPath);
    } else {
      path = this.parseLocation();
    }

    const clz: IViewConstructor | undefined = this.routes.get(path);
    if (!clz) {
      return undefined;
    } else {
      const view = new clz();
      view.render();
      return view;
    }
  }

  private initRoutes(): MyType {
    const routes: MyType = new Map();
    const views: Array<IViewConstructor> = [MainPage, TextbookView];
    views.forEach((v) => {
      routes.set(v.getPath(), v);
    });
    return routes;
  }

  // private getComponentByPath(path, routes) {
  //   return routes.find(r => r.path.match(new RegExp(`^\\${path}$`, 'gm'))) || undefined;
  // }

  private parseLocation(): string {
    return location.hash.slice(1).toLowerCase() || '/';
  }
}

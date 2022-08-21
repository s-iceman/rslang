import { IViewConstructor, ViewOrNotInit } from '../views/interfaces';
import { MainPage } from '../views/mainPage';
import { TextBookView } from '../views/textbook/textbook';

type MyType = Map<string, IViewConstructor>;

export class Router {
  private routes: MyType;

  constructor() {
    this.routes = this.initRoutes();
  }

  process(newPath?: string): ViewOrNotInit {
    let path = '';
    if (newPath) {
      path = newPath;
      window.history.pushState({}, newPath, `${newPath}`);
    } else {
      path = this.parseLocation();
    }

    const clz: IViewConstructor | undefined = this.routes.get(path);
    if (!clz) {
      return null;
    } else {
      const view = new clz();
      view.render();
      return view;
    }
  }

  private initRoutes(): MyType {
    const routes: MyType = new Map();
    const views: Array<IViewConstructor> = [MainPage, TextBookView];
    views.forEach((v) => {
      routes.set(v.getPath(), v);
    });
    return routes;
  }

  private parseLocation(): string {
    return location.hash.slice(1).toLowerCase() || '/';
  }
}

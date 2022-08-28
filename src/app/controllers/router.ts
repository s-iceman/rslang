import { ViewPath } from '../common/constants';
import { IViewConstructor, ViewOrNotInit } from '../views/interfaces';
import { LoginView } from '../views/loginPage/login';
import { MainPage } from '../views/mainPage/mainPage';
import { TextBookView } from '../views/textbook/textbook';
import { StatisticsView } from '../views/statistics/statistics';

type MyType = Map<string, IViewConstructor>;

const ALL_VIEWS = [MainPage, TextBookView, StatisticsView, LoginView];
const ANCHORS = {
  [ViewPath.ABOUT]: ViewPath.MAIN,
  [ViewPath.TEAM]: ViewPath.MAIN,
};

export class Router {
  private routes: MyType;

  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.routes = this.initRoutes();
  }

  process(newPath?: string): ViewOrNotInit {
    const [path, anchor] = newPath ? [newPath, ''] : this.getLocation();

    const clz: IViewConstructor | undefined = this.routes.get(path);
    if (!clz) {
      return null;
    } else {
      const view = new clz(this.baseUrl);
      window.localStorage.setItem('page', clz.getPath());
      if (anchor) {
        window.location.href = window.location.pathname + anchor;
      }
      return view;
    }
  }

  private initRoutes(): MyType {
    const routes: MyType = new Map();
    const views: Array<IViewConstructor> = ALL_VIEWS;
    views.forEach((v) => {
      routes.set(v.getPath(), v);
    });
    return routes;
  }

  private getLocation(): [string, string] {
    const rawPath = location.hash.toLowerCase();
    let path = '';
    let anchor = '';
    if (rawPath in ANCHORS) {
      path = <string>ANCHORS[rawPath];
      anchor = rawPath;
    } else {
      path = location.hash.slice(1).toLowerCase() || '/';
    }
    return [path, anchor];
  }
}

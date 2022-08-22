import AppModel from '../models/AppModel';
import State from '../models/State';
import AppView from '../view/AppView';

export default class AppControler extends State {
  baseUrl: string;

  model: AppModel;

  view: AppView;

  constructor() {
    super();
    this.baseUrl = 'http://localhost:8088';
    this.model = new AppModel(this.baseUrl);
    this.view = new AppView(this.baseUrl);
  }

  async renderWords() {
    const data = await this.model.getWords(0, 29);
    this.view.renderWordList(data);
  }

  async init() {
    const data = await this.model.getWords(4, 5);
    this.view.init(data);
  }
}

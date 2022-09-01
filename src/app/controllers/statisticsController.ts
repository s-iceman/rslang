import AppModel from '../models/AppModel';
import State from '../models/State';
import { IStatisticsController } from './interfaces';
import { StatisticsViewOrNotInit } from '../views/interfaces';
import { StatisticsView } from '../views/statistics/statistics';
import { IStatistics } from '../models/interfaces';

export class StatisticsController extends State implements IStatisticsController {
  private baseUrl: string;

  private model: AppModel;

  private statisticsView: StatisticsViewOrNotInit;

  constructor(baseUrl: string, model: AppModel) {
    super();
    this.statisticsView = null;
    this.baseUrl = baseUrl;
    this.model = model;
  }

  registerView(view: StatisticsViewOrNotInit): void {
    if (view instanceof StatisticsView) {
      this.statisticsView = view;
      this.statisticsView.setController(this);
    } else {
      this.statisticsView = null;
    }
  }

  async updateView(): Promise<void> {
    if (this.statisticsView) {
      try {
        const data = await this.getStatistics();
        console.log('!!!', data);
      } catch (err) {
        this.statisticsView.setError();
      }
    }
  }

  async getStatistics(): Promise<IStatistics> {
    const data = await this.model.getUserStatistics();
    return data;
  }
}

import { IModelHelper } from '../interfaces';
import AppModel from '../../models/AppModel';
import { StartGameOptions, GameWord } from '../types';
import { IApiWords } from '../../models/interfaces';
import { UnitLevels, GameType } from '../constants';
import { MAX_PAGE_WORDS } from '../../common/constants';

abstract class BaseModelHelper implements IModelHelper {
  protected model: AppModel;

  protected context: StartGameOptions | undefined;

  constructor(model: AppModel, context?: StartGameOptions) {
    this.model = model;
    this.context = context;
  }

  abstract getWords(gameType: GameType, level?: UnitLevels): Promise<GameWord[][]>;

  protected getRandomPage(): number {
    return Math.round(Math.random() * MAX_PAGE_WORDS);
  }
}

class ModelHelper extends BaseModelHelper {
  async getWords(gameType: GameType, level?: UnitLevels): Promise<GameWord[][]> {
    let other: IApiWords[] = [];
    let targetWords: IApiWords[] = [];
    const page = (level !== undefined ? this.getRandomPage() : this.context?.page) || 0;
    const unit = level !== undefined ? level : this.context?.unit;

    if (gameType === GameType.Sprint) {
      const availablePages = [...Array(page).keys()];
      targetWords = await this.model.getWords(unit, page);
      const rawOther = await Promise.all(availablePages.map(async (p) => this.model.getWords(unit, p)));
      other = rawOther.flat(1);
    } else if (gameType === GameType.VoiceCall) {
      targetWords = await this.model.getWords(unit, page);
    } else {
      throw new Error('Invalid game type');
    }
    return [targetWords, other];
  }
}

export { ModelHelper, BaseModelHelper };

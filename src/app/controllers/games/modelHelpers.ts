import { IModelHelper } from '../interfaces';
import AppModel from '../../models/AppModel';
import { StartGameOptions } from '../types';
import { IApiWords } from '../../models/interfaces';
import { UnitLevels } from '../constants';
import { MAX_PAGE_WORDS } from '../../constants';

class ModelHelper implements IModelHelper {
  protected model: AppModel;

  private context: StartGameOptions | undefined;

  constructor(model: AppModel, context?: StartGameOptions) {
    this.model = model;
    this.context = context;
  }

  async getWords(level?: UnitLevels): Promise<IApiWords[]> {
    let words: IApiWords[];
    if (level !== undefined) {
      const page = Math.random() * MAX_PAGE_WORDS;
      words = await this.model.getWords(level, page);
    } else {
      words = await this.model.getWords(this.context?.unit, this.context?.page);
    }
    return words;
  }
}

class UserModelHelper extends ModelHelper {
  // todo - for login user
}

export { ModelHelper };

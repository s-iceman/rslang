import { UnitLevels } from '../controllers/constants';

const UnitLabels = {
  [UnitLevels.A1]: 'beginner',
  [UnitLevels.A2]: 'pre-intermediate',
  [UnitLevels.B1]: 'intermediate',
  [UnitLevels.B2]: 'upper-intermediate',
  [UnitLevels.C1]: 'advanced',
  [UnitLevels.C2]: 'proficient',
  [UnitLevels.Hard]: 'hard',
};
Object.freeze(UnitLabels);

const enum PaginBtnType {
  First = 0,
  Prev,
  Current,
  Next,
  Last,
}

const enum AnswerBtnType {
  Correct = 0,
  Incorrect = 1,
}

export { UnitLabels, PaginBtnType, AnswerBtnType };

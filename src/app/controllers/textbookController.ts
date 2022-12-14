import { ViewOrNotInit, TextBookViewOrNotInit } from '../views/interfaces';
import { START_PAGE } from '../views/textbook/constants';
import { TextBookView } from '../views/textbook/textbook';
import { DifficultyWord, UnitLevels } from './constants';
import { TextBookState } from './types';
import { ITextBookController } from './interfaces';
import AppModel from '../models/AppModel';
import { IApiWords, IOptional, IUserAggregatedWords, IUserWord } from '../models/interfaces';
import State from '../models/State';
import { UnitLabels } from '../views/constants';
import { MIN_PAGE_WORDS, MAX_GROUP_WORDS, MAX_PAGE_WORDS } from '../common/constants';

export class TextBookController extends State implements ITextBookController {
  private textBookState: TextBookState;

  private baseUrl: string;

  private model: AppModel;

  private textBookView: TextBookViewOrNotInit;

  constructor(baseUrl: string, model: AppModel) {
    super();
    const savedUnit: string | null = window.localStorage.getItem('unit');
    const savedUnitLevel = savedUnit && this.getUnitLevelByName(savedUnit);
    this.textBookState = {
      unit: savedUnitLevel || UnitLevels.A1,
      page: Number(window.localStorage.getItem('unit-page')) || START_PAGE,
    };
    this.textBookView = null;
    this.baseUrl = baseUrl;
    this.model = model;
  }

  getUnit(): UnitLevels {
    return this.textBookState.unit;
  }

  getPage(): number {
    return this.textBookState.page;
  }

  registerView(view: ViewOrNotInit): void {
    if (view instanceof TextBookView) {
      this.textBookView = view;
      this.textBookView.setController(this);
    } else {
      this.textBookView = null;
    }
  }

  async updateView(): Promise<void> {
    if (this.textBookView) {
      await this.setTextBookView();
    }
  }

  public async selectUnit(unitName: string): Promise<void> {
    this.removeSound();
    const level = this.getUnitLevelByName(unitName);
    if (!level) {
      return;
    }
    this.textBookState.unit = level;
    this.updatePage(START_PAGE);
    const words = await this.getWords();
    this.textBookView?.updateUnit?.(unitName, words);
    window.localStorage.setItem('unit', unitName);
  }

  public async changeUnitPage(page: number): Promise<void> {
    this.removeSound();
    this.updatePage(page);
    const words = await this.getWords(page);
    const unitName: string = UnitLabels[this.textBookState.unit];
    if (unitName) {
      this.textBookView?.updateCards?.(unitName, words);
    }
  }

  async playSound(wordsItem: IApiWords, node: HTMLElement): Promise<void> {
    const { audio, audioMeaning, audioExample } = wordsItem;

    const playActive = document.querySelector('.play--active');
    if (playActive) playActive.classList.remove('play--active');

    node.classList.add('play--active');
    const playlist = [audio, audioMeaning, audioExample];

    this.removeSound();

    const onPlay = async (sound: HTMLAudioElement) => {
      void sound.play();
      await new Promise<void>((resolve) => sound.addEventListener('ended', () => resolve()));
    };

    for (let i = 0; i < playlist.length; i++) {
      const sound = new Audio(`${this.baseUrl}/${playlist[i]}`);
      this.setSoundList(sound);
      await onPlay(sound);
    }
    node.classList.remove('play--active');
  }

  public removeSound() {
    this.getSoundList().forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
    this.clearSoundList();
  }

  async createUserWord(wordId: string, isDifficulty = false, isStudy = false): Promise<void> {
    const getWords = await this.model.getUserWords();
    const filterWords = getWords?.filter((item) => item.wordId === wordId) || [];
    const currentGroup = Number(this.getUnit());
    const currentPage = this.getPage();

    if (filterWords.length) {
      if (isDifficulty) {
        const optional = this.updateUserOptional(getWords, wordId, isStudy);
        await this.model.updateUserWord(wordId, DifficultyWord.Hard, optional);
      } else {
        const optional = this.updateUserOptional(getWords, wordId, isStudy);
        await this.model.updateUserWord(wordId, DifficultyWord.Simple, optional);
      }
    } else if (!filterWords.length) {
      if (isDifficulty) {
        await this.model.postUserWord(wordId, DifficultyWord.Hard, { study: isStudy });
      } else {
        await this.model.postUserWord(wordId, DifficultyWord.Simple, { study: isStudy });
      }
    }

    const getWordsPage = await this.getAggregatedWords(currentGroup, currentPage);
    const isWordsLearned = this.checkLearnedWords(getWordsPage);
    const isLearnedPage = this.checkLearnedPage(getWordsPage);
    isLearnedPage ? this.textBookView?.toggleStyleLearnedPage(true) : this.textBookView?.toggleStyleLearnedPage(false);
    isWordsLearned ? this.textBookView?.toggleStyleGameBlock(true) : this.textBookView?.toggleStyleGameBlock(false);
  }

  public checkLearnedPage(wordsData: IApiWords[]) {
    return wordsData.every((word) => {
      if (word.userWord) {
        const { difficulty, optional } = word.userWord;
        return difficulty === DifficultyWord.Hard || optional.study;
      }
    });
  }

  public checkLearnedWords(wordsData: IApiWords[]) {
    return wordsData.every((word) => (word.userWord ? word.userWord.optional.study : false));
  }

  async getWords(page?: number): Promise<IApiWords[]> {
    let currentPage: number = page || this.textBookState.page;
    currentPage = this.validatePage(currentPage) ? currentPage : START_PAGE;

    const currentGroup = Number(this.getUnit());

    let wordsData: IApiWords[];
    if (this.isAuth() && currentGroup <= MAX_GROUP_WORDS) {
      wordsData = await this.getAggregatedWords(currentGroup, currentPage);
    } else {
      wordsData = await this.model.getWords(currentGroup, currentPage);
    }

    return wordsData;
  }

  async getAggregatedWords(currentGroup: number, currentPage: number) {
    let wordsUserData: IUserAggregatedWords[];
    if (currentGroup === MAX_GROUP_WORDS) {
      wordsUserData = await this.model.aggregatedHardWords();
    } else {
      wordsUserData = await this.model.userAggregatedWords(currentGroup, currentPage);
    }
    if (wordsUserData) {
      return <IApiWords[]>wordsUserData[0].paginatedResults.map((item) =>
        Object.keys(item).reduce((acc, key) => {
          if (key === '_id') {
            acc[key.slice(1)] = item[key];
          } else {
            acc[key] = <string>item[key];
          }
          return acc;
        }, {})
      );
    } else {
      return [];
    }
  }

  async setTextBookView(): Promise<void> {
    const unitName: string = UnitLabels[this.textBookState.unit];
    const words = await this.getWords();
    this.textBookView?.updateCards(unitName, words);
    this.textBookView?.updatePage(this.textBookState.page);
  }

  private updateUserOptional(words: IUserWord[], wordId: string, isStudy: boolean): IOptional {
    let optional = words.find((w) => w.wordId === wordId)?.optional;
    if (optional) {
      optional.study = isStudy;
    } else {
      optional = { study: isStudy };
    }
    return optional;
  }

  private getUnitLevelByName(unitName: string): UnitLevels | undefined {
    const keys = new Map(
      Object.entries(UnitLabels).map((entry) => entry.reverse()) as [string, keyof typeof UnitLabels][]
    );
    return keys.get(unitName);
  }

  private updatePage(page: number): void {
    this.textBookState.page = page;
    window.localStorage.setItem('unit-page', page.toString());
  }

  private validatePage(page: number): boolean {
    return page >= MIN_PAGE_WORDS && page <= MAX_PAGE_WORDS;
  }
}

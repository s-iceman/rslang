import { ViewOrNotInit, TextBookViewOrNotInit } from '../views/interfaces';
import { TextBookView } from '../views/textbook/textbook';
import { UnitLevels } from './constants';
import { ITextBookController } from './interfaces';
import AppModel from '../models/AppModel';
import { IApiWords, IUserAggregatedWords } from '../models/interfaces';
import State from '../models/State';
import { UnitLabels } from '../views/constants';
import { MAX_GROUP_WORDS, MAX_PAGE_WORDS, MIN_PAGE_WORDS } from '../models/constants';

export class TextBookController extends State implements ITextBookController {
  private activeUnit: UnitLevels;

  private baseUrl: string;

  private model: AppModel;

  private textBookView: TextBookViewOrNotInit;

  constructor(baseUrl: string) {
    super();
    this.activeUnit = UnitLevels.A1;
    this.textBookView = null;
    this.baseUrl = baseUrl;
    this.model = new AppModel(this.baseUrl);
  }

  getUnit(): UnitLevels {
    return this.activeUnit;
  }

  async setView(view: ViewOrNotInit): Promise<void> {
    if (view instanceof TextBookView) {
      this.textBookView = view;
      this.textBookView.setController(this);

      const unitName: string = window.localStorage.getItem('unit') || 'beginners';
      const words = await this.getWords();
      this.textBookView.updateCards(unitName, words, this.getUnit());
    } else {
      this.textBookView = null;
    }
  }

  public async selectUnit(unitName: string): Promise<void> {
    this.removeSound();
    const keys = new Map(
      Object.entries(UnitLabels).map((entry) => entry.reverse()) as [UnitLabels, keyof typeof UnitLabels][]
    );
    const level: string | undefined = keys.get(<UnitLabels>unitName);
    if (!level) {
      return;
    }
    this.activeUnit = UnitLevels[level as keyof typeof UnitLevels];
    const words = await this.getWords();
    this.textBookView?.updateCards?.(unitName, words, this.getUnit());
    window.localStorage.setItem('unit', unitName);
  }

  public async changeUnitPage(page: number): Promise<void> {
    this.removeSound();
    const words = await this.getWords(page);
    const unitName: string | null = window.localStorage.getItem('unit');
    if (unitName) {
      this.textBookView?.updateCards?.(unitName, words, this.getUnit());
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

  removeSound() {
    this.getSoundList().forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
    this.clearSoundList();
  }

  async createUserWord(wordId: string, isDifficulty = false, isStudy = false): Promise<void> {
    const getWords = await this.model.getUserWords();
    const filterWords = getWords?.filter((item) => item.wordId === wordId) || [];

    if (filterWords.length) {
      const difficulty = filterWords[0].difficulty;
      const { study } = filterWords[0].optional;

      if (isStudy) await this.model.updateUserWord(wordId, difficulty, isStudy);
      if (isDifficulty) await this.model.updateUserWord(wordId, 'hard', study);
      if (!isDifficulty && !isStudy) await this.model.updateUserWord(wordId, 'simple', study);
    } else if (!filterWords.length) {
      if (isStudy) await this.model.postUserWord(wordId, 'simple', isStudy);
      if (isDifficulty) await this.model.postUserWord(wordId, 'hard', isStudy);
    }
  }

  async getWords(page = MIN_PAGE_WORDS): Promise<IApiWords[]> {
    const currentPage = page < MAX_PAGE_WORDS && page >= MIN_PAGE_WORDS ? page : MIN_PAGE_WORDS;
    const currentGroup = this.getUnit();

    let wordsData: IApiWords[];
    if (this.isAuth() && currentGroup < MAX_GROUP_WORDS) {
      wordsData = await this.getAggregatedWords(currentGroup, currentPage);
    } else if (this.isAuth() && currentGroup === MAX_GROUP_WORDS) {
      wordsData = await this.getAggregatedWords(currentGroup, currentPage);
    } else {
      wordsData = await this.model.getWords(currentGroup, currentPage);
    }
    return wordsData;
  }

  // todo: move from here

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
}

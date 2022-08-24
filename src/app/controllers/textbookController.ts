import { ViewOrNotInit, TextBookViewOrNotInit } from '../views/interfaces';
import { TextBookView } from '../views/textbook/textbook';
import { UnitLevels } from './constants';
import { ITextBookController } from './interfaces';
import AppModel from '../models/AppModel';
import { IApiWords } from '../models/interfaces';
import State from '../models/State';
import { UnitLabels } from '../views/constants';

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
      this.textBookView.updateCards(unitName, words);
    } else {
      this.textBookView = null;
    }
  }

  public async selectUnit(unitName: string): Promise<void> {
    const keys = new Map(
      Object.entries(UnitLabels).map((entry) => entry.reverse()) as [UnitLabels, keyof typeof UnitLabels][]
    );
    const level: string | undefined = keys.get(<UnitLabels>unitName);
    if (!level) {
      return;
    }
    this.activeUnit = UnitLevels[level as keyof typeof UnitLevels];
    const words = await this.getWords();
    this.textBookView?.updateCards?.(unitName, words);
    window.localStorage.setItem('unit', unitName);
  }

  public async changeUnitPage(page: number): Promise<void> {
    const words = await this.getWords(page);
    const unitName: string | null = window.localStorage.getItem('unit');
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

    if (this.getSoundList()) {
      this.getSoundList().forEach((sound) => {
        sound.pause();
        sound.currentTime = 0;
      });
      this.clearSoundList();
    }

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

  async createUserWord(wordId: string, isDifficulty = false, isStudy = false): Promise<void> {
    const getWords = await this.model.getUserWords();
    const filterWords = getWords?.filter((item) => item.wordId === wordId) || [];

    if (!filterWords.length && isStudy) {
      await this.model.setUserWord(wordId, 'POST', 'simple', isStudy);
    } else if (filterWords.length > 0 && isStudy) {
      const difficulty = filterWords[0].difficulty;
      await this.model.setUserWord(wordId, 'PUT', difficulty, isStudy);
    }

    if (!filterWords.length && isDifficulty) {
      await this.model.setUserWord(wordId, 'POST', 'hard', isStudy);
    } else if (filterWords.length > 0 && isDifficulty) {
      const { study } = filterWords[0].optional;
      await this.model.setUserWord(wordId, 'PUT', 'hard', study);
    }
  }

  async getWords(page = 1): Promise<IApiWords[]> {
    const wordsData = await this.model.getWords(this.getUnit(), page);
    return wordsData;
  }

  isAuth(): boolean {
    return true;
  }

  // todo: move from here
  async userSign() {
    const user = { email: 'test@mail.com', password: '123456789' };

    const data = await this.model.signIn(user);

    if (data) {
      const userInfo = {
        isAuth: true,
        name: `${data.name || ''}`,
        token: `${data.token || ''}`,
        userId: `${data.userId || ''}`,
      };
      localStorage.setItem('user', JSON.stringify(userInfo));
      // await this.renderWords();
    }
  }
}

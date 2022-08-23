import AppModel from '../models/AppModel';
import { IApiWords } from '../models/interfaces';
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

  async playSound(wordsItem: IApiWords, node: HTMLElement) {
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
      await this.renderWords();
    }
  }

  async createUserWord(wordId: string, isDifficulty = false, isStudy = false) {
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

  async renderWords() {
    const wordsData = await this.model.getWords(4, 5);
    this.view.renderWordList(wordsData);
  }

  async init() {
    this.view.init();
    await this.renderWords();
  }
}

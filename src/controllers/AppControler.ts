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

  async init() {
    const data = await this.model.getWords(4, 5);
    this.view.init(data);
  }
}

import { ViewPath } from '../../common/constants';
import { VoiceCallStartPage } from './common/startPage';
import { BaseGameView } from './common/baseGame';
import { GameType } from '../../controllers/constants';
import { GameCardData } from '../../controllers/types';
import CreateMarkup from '../common/createMarkup';
import { DropDownTimer } from './common/timer';

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export class VoiceCallView extends BaseGameView {
  private word: HTMLElement | undefined;

  private translation: HTMLElement | undefined;

  private audioFileName: string;

  private controls: CreateMarkup<HTMLElement> | undefined;

  private optionsBtn: CreateMarkup<HTMLElement>[] | undefined;

  constructor(baseUrl: string) {
    super(baseUrl);
    this.startPage = new VoiceCallStartPage();
    this.word = undefined;
    this.translation = undefined;
    this.audioFileName = '';
    this.controls = undefined;
    this.optionsBtn = [];
  }

  static getPath(): string {
    return ViewPath.VOICECALL;
  }

  getGameType(): GameType {
    return GameType.VoiceCall;
  }

  createWordCard(data: GameCardData): HTMLElement {
    this.audioFileName = data.word.audio;
    const card = document.createElement('div');
    card.className = 'game-card wrapper';
    this.gameCard = card;
    const points = new CreateMarkup(card, 'div', 'play-btn');

    const playAudioBtn = new CreateMarkup(points.node, 'div', 'word__play');
    playAudioBtn.node.addEventListener('click', () => void this.playSound(this.audioFileName));

    const cardWord = new CreateMarkup(card, 'div', 'game-card__word game-word');
    const originWord = new CreateMarkup(cardWord.node, 'h3', 'game-word__origin');
    originWord.node.textContent = data.word.word;
    const translation = new CreateMarkup(cardWord.node, 'span', 'game-word__translate');
    translation.node.textContent = data.word.transcription;

    this.word = originWord.node;
    this.translation = translation.node;

    this.controls = new CreateMarkup(card, 'div', 'game-card__controls');
    this.optionsBtn = [];
    for (let i = 0; i < 5; i++) {
      const newOptionBtn = new CreateMarkup(this.controls.node, 'button', 'button game-card__btn');
      this.optionsBtn.push(newOptionBtn);
    }
    this.createOptionBtn(data);
    this.gameControls = this.controls.node;
    return card;
  }

  createOptionBtn(data: GameCardData) {
    this.optionsBtn?.forEach((element, index) => {
      console.log(element);
      element.node.textContent = `${index + 1}. ` + capitalizeFirstLetter(data.options[index]);
      this.optionsBtn![index].node.id = String(index);
    });
  }

  showWord(data: GameCardData): void {
    this.createOptionBtn(data);
    if (this.word && this.translation) {
      this.word.textContent = data.word.word;
      this.translation.textContent = `${data.word.transcription}`;
      this.audioFileName = data.word.audio;
    }
    return;
  }

  async playSound(wordsItem: string) {
    const onPlay = async (sound: HTMLAudioElement) => {
      void sound.play();
      await new Promise<void>((resolve) => sound.addEventListener('ended', () => resolve()));
    };
    const sound = new Audio(`${this.baseUrl}/${wordsItem}`);
    await onPlay(sound);
  }

  processKey(event: KeyboardEvent): void {
    const key = Number(event.key);
    const correctKeys = [1, 2, 3, 4, 5];
    if (correctKeys.includes(key)) {
      this.ctrl?.processAnswer(key - 1);
    }
    return;
  }
}

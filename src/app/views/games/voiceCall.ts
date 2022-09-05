import { ViewPath } from '../../common/constants';
import { VoiceCallStartPage } from './common/startPage';
import { BaseGameView } from './common/baseGame';
import { GameType } from '../../controllers/constants';
import { GameCardData } from '../../controllers/types';
import CreateMarkup from '../common/createMarkup';
import { AudioCallEngine } from '../../controllers/games/gameEngines';

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export class VoiceCallView extends BaseGameView {
  private goNextBnt: HTMLElement | undefined;

  private correctWord: HTMLElement | undefined;

  private correctWordTranscription: HTMLElement | undefined;

  private correctWordTranslate: HTMLElement | undefined;

  private audioFileName: string;

  private controls: CreateMarkup<HTMLElement> | undefined;

  private optionsBtn: CreateMarkup<HTMLElement>[] | undefined;

  private step: number;

  private newData: GameCardData | undefined;

  constructor(baseUrl: string) {
    super(baseUrl);
    this.startPage = new VoiceCallStartPage();
    this.goNextBnt = undefined;
    this.correctWord = undefined;
    this.correctWordTranscription = undefined;
    this.correctWordTranslate = undefined;
    this.audioFileName = '';
    this.controls = undefined;
    this.optionsBtn = [];
    this.step = 0;
    this.newData = undefined;
  }

  static getPath(): string {
    return ViewPath.VOICECALL;
  }

  getGameType(): GameType {
    return GameType.VoiceCall;
  }

  createWordCard(data: GameCardData): HTMLElement {
    this.step = 0;
    this.newData = data;
    this.audioFileName = data.word.audio;
    this.playSound(this.audioFileName).catch((error) => console.log(error));
    const card = document.createElement('div');
    card.className = 'game-card wrapper';
    this.gameCard = card;
    const points = new CreateMarkup(card, 'div', 'play-btn');

    const playAudioBtn = new CreateMarkup(points.node, 'div', 'word__play');
    playAudioBtn.node.addEventListener('click', () => void this.playSound(this.audioFileName));

    const cardWord = new CreateMarkup(card, 'div', 'game-card__word game-word-audio');

    const correctWord = new CreateMarkup(cardWord.node, 'div', 'audio-correct-word');
    this.correctWord = correctWord.node;

    const correctWordTranscription = new CreateMarkup(cardWord.node, 'div', 'audio-correct-word__transcription');
    this.correctWordTranscription = correctWordTranscription.node;

    const correctWordTranslate = new CreateMarkup(cardWord.node, 'div', 'audio-correct-word__translate');
    this.correctWordTranslate = correctWordTranslate.node;

    const goNextBnt = new CreateMarkup(cardWord.node, 'div', 'button game-card__btn');

    goNextBnt.node.textContent = 'Далее ►';
    goNextBnt.node.id = '10';
    this.goNextBnt = goNextBnt.node;

    this.controls = new CreateMarkup(card, 'div', 'game-card__controls');
    this.optionsBtn = [];
    for (let i = 0; i < 5; i++) {
      const newOptionBtn = new CreateMarkup(this.controls.node, 'button', 'button-audio game-card__btn');
      newOptionBtn.node.addEventListener('click', (event) => this.displayCorrectOption(event, this.newData));
      this.optionsBtn.push(newOptionBtn);
    }
    this.createOptionBtn(data);
    this.gameControls = goNextBnt.node;
    return card;
  }

  createOptionBtn(data: GameCardData) {
    this.goNextBnt!.id = '10';
    this.correctWord!.innerHTML = '';
    this.correctWordTranscription!.innerHTML = '';
    this.correctWordTranslate!.innerHTML = '';
    this.optionsBtn?.forEach((element, index) => {
      element.node.textContent = `${index + 1}. ` + capitalizeFirstLetter(data.options[index]);
      this.optionsBtn![index].node.id = index.toString();
      this.optionsBtn![index].node.classList.remove('game-card__btn_false');
      this.optionsBtn![index].node.removeAttribute('disabled');
      const inCorrectOptions = this.optionsBtn?.filter((el, indexs) => indexs !== Number(this.goNextBnt?.id));
      inCorrectOptions?.forEach((options) => {
        options.node.classList.remove('game-card__btn_true');
        options.node.removeAttribute('disabled');
      });
    });
  }

  displayCorrectOption(event: MouseEvent, data?: GameCardData) {
    const corectOption = AudioCallEngine.correctAnserw[this.step];
    const coosenOptins = (<HTMLElement>event.target).id;
    const inCorrectOptions = this.optionsBtn?.filter((el, index) => index !== corectOption);
    inCorrectOptions?.forEach((options) => {
      options.node.classList.add('game-card__btn_false');
      options.node.setAttribute('disabled', 'disabled');
    });
    this.optionsBtn![corectOption].node.classList.add('game-card__btn_true');
    this.optionsBtn![corectOption].node.setAttribute('disabled', 'disabled');
    this.goNextBnt!.id = coosenOptins;
    this.correctWord!.innerHTML = data!.word.word;
    this.correctWordTranscription!.innerHTML = data!.word.transcription;
    this.correctWordTranslate!.innerHTML = data!.word.wordTranslate;
  }

  showWord(data: GameCardData): void {
    this.step++;
    this.newData = data;
    this.createOptionBtn(data);
    this.audioFileName = data.word.audio;
    this.playSound(this.audioFileName).catch((error) => console.debug(error));
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

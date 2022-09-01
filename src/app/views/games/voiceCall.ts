import { ViewPath } from '../../common/constants';
import { VoiceCallStartPage } from './common/startPage';
import { BaseGameView } from './common/baseGame';
import { GameType } from '../../controllers/constants';
import { GameCardData } from '../../controllers/types';
import { IApiWords } from '../../models/interfaces';

export class VoiceCallView extends BaseGameView {
  constructor(baseUrl: string) {
    super(baseUrl);
    this.startPage = new VoiceCallStartPage();
  }

  static getPath(): string {
    return ViewPath.VOICECALL;
  }

  getGameType(): GameType {
    return GameType.VoiceCall;
  }

  createWordCard(data?: GameCardData): HTMLElement {
    const parent: HTMLElement = document.createElement('div');
    parent.textContent = 'HELLO';
    return parent;
  }

  showWord(data: GameCardData): void {
    // todo
    return;
  }

  processKey(event: KeyboardEvent): void {
    // todo
    return;
  }
}

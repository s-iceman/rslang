export class SoundController {
  private playerCorrect: HTMLAudioElement;

  private playerIncorrect: HTMLAudioElement;

  constructor() {
    this.playerCorrect = new Audio('../../assets/sound/correct-answer.wav');
    this.playerIncorrect = new Audio('../../assets/sound/wrong-answer.wav');
  }

  async play(isCorrect: boolean): Promise<void> {
    if (isCorrect) {
      await this.playerCorrect.play();
    } else {
      await this.playerIncorrect.play();
    }
  }
}

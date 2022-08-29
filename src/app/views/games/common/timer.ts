export class DropDownTimer {
  private timeLimit: number;

  private currentTime: number;

  private timerId: number;

  private timerBlock: HTMLElement;

  constructor() {
    this.timeLimit = 0;
    this.currentTime = 0;
    this.timerId = -1;
    this.timerBlock = this.createTimer();
  }

  startTimer(time: number) {
    this.timeLimit = this.currentTime = time;
    this.timerId = window.setInterval(() => {
      if (this.currentTime === 0) {
        window.clearInterval(this.timerId);
        this.timerId = -1;
      }
      this.timerBlock.innerHTML = String(this.currentTime);
      this.currentTime -= 1;
    }, 1000);
  }

  stopTimer(): void {
    window.clearInterval(this.timerId);
    this.currentTime = 0;
    this.timerId = -1;
  }

  getTimerBlock(): HTMLElement {
    return this.timerBlock;
  }

  private createTimer(): HTMLElement {
    const block: HTMLElement = document.createElement('div');
    block.className = 'game__timer';
    block.textContent = this.timeLimit.toString();
    return block;
  }
}

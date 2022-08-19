import { IView } from "./interfaces";

export class MainPage implements IView {
  private root: HTMLElement;

  constructor() {
    this.root = <HTMLElement>document.querySelector('.root');
  }

  render(): void {
    this.root.innerHTML = this.getContent();
  }

  private getContent(): string {
    return `<div>Hello, world!</div>`;
  }
}
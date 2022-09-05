export abstract class View {
  protected baseUrl: string;

  protected root: HTMLElement;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.root = <HTMLElement>document.querySelector('.root');
  }

  static getPath(): string {
    return '';
  }
}

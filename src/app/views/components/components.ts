abstract class Component {
  protected container: HTMLElement;

  constructor(tagName: string, className: string, id?: string) {
    this.container = document.createElement(tagName);
    this.container.className = className;
    id ? (this.container.id = id) : this.container.removeAttribute('id');
  }

  render() {
    return this.container;
  }
}

export default Component;

export default class CreateMarkup<NodeType extends HTMLElement = HTMLElement> {
  public node: NodeType;

  constructor(parentNode: HTMLElement, tagName = 'div', className = '', content = '') {
    const elem = document.createElement(tagName);
    elem.className = className;
    elem.innerHTML = content;
    if (parentNode) parentNode.append(elem);
    this.node = <NodeType>elem;
  }

  remove() {
    this.node.remove();
  }
}

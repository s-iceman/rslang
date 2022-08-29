import CreateMarkup from '../../common/createMarkup';

export const createResults = (words: string[][]): HTMLElement => {
  const parent = document.createElement('div');
  parent.className = 'result-page';
  parent.id = 'results';
  const container = new CreateMarkup(parent, 'div', 'game__container');
  container.node.style.fontSize = '14px';

  if (words.length === 0) {
    parent.textContent = 'Вы не дали не одного ответа';
    return parent;
  }

  new CreateMarkup(container.node, 'div', '', 'Верные ответы');
  words[0].forEach((w) => {
    new CreateMarkup(container.node, 'div', '', w);
  });
  new CreateMarkup(container.node, 'div', '', 'Неверные ответы');
  words[1].forEach((w) => {
    new CreateMarkup(container.node, 'div', '', w);
  });
  const btn = new CreateMarkup(container.node, 'button', 'button', 'Закрыть');
  btn.node.id = 'close-results';
  return parent;
};

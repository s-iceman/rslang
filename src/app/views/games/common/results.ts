import CreateMarkup from '../../common/createMarkup';

export const createResults = (words: string[][]): HTMLElement => {
  const parent = document.createElement('div');
  parent.className = 'result-page wrapper';
  parent.id = 'results';
  const container = new CreateMarkup(parent, 'div', 'game__container');

  if (words.length === 0) {
    parent.textContent = 'Вы не дали не одного ответа';
    return parent;
  }

  const correctAnswers = new CreateMarkup(container.node, 'div', 'correct-answers', 'Верные ответы');
  const correctList = new CreateMarkup(correctAnswers.node, 'ul', 'correct-answers__list');
  words[0].forEach((w) => {
    new CreateMarkup(correctList.node, 'li', '', w);
  });

  const wrongAnswers = new CreateMarkup(container.node, 'div', 'wrong-answers', 'Неверные ответы');
  const wrongtList = new CreateMarkup(wrongAnswers.node, 'ul', 'wrong-answers__list');
  words[1].forEach((w) => {
    new CreateMarkup(wrongtList.node, 'li', '', w);
  });

  const btn = new CreateMarkup(container.node, 'button', 'button game-card__btn', 'Закрыть');
  btn.node.id = 'close-results';
  return parent;
};

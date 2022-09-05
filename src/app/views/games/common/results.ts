import CreateMarkup from '../../common/createMarkup';

export const createResults = (words: string[][], score: number, parentNode: HTMLElement): HTMLElement => {
  const resultPage = new CreateMarkup(parentNode, 'div', 'result-page wrapper');
  resultPage.node.id = 'results';

  const resultPageTitle = `Ваш результат ${score} очков.`;
  new CreateMarkup(resultPage.node, 'h2', 'result-page__title', resultPageTitle);

  if (words.length === 0) {
    new CreateMarkup(resultPage.node, 'h3', 'result-page__subtitle', '<h3>Вы не дали не одного ответа</h3>');
  } else {
    const answers = new CreateMarkup(resultPage.node, 'div', 'answers');
    const correctAnswersTitle = `<h3>Верных ответов <span>${words[0].length}</span></h3>`;
    const correctAnswers = new CreateMarkup(answers.node, 'div', 'answers__list correct-answers', correctAnswersTitle);
    const correctList = new CreateMarkup(correctAnswers.node, 'ol', 'correct-answers__list');
    words[0].forEach((w) => {
      new CreateMarkup(correctList.node, 'li', 'correct-answers__item', w);
    });

    const wrongAnswersTitle = `<h3>Неверных ответов <span>${words[1].length}</span></h3>`;
    const wrongAnswers = new CreateMarkup(answers.node, 'div', 'answers__list wrong-answers', wrongAnswersTitle);
    const wrongtList = new CreateMarkup(wrongAnswers.node, 'ol', 'wrong-answers__list');
    words[1].forEach((w) => {
      new CreateMarkup(wrongtList.node, 'li', 'wrong-answers__item', w);
    });
  }

  const btn = new CreateMarkup(resultPage.node, 'button', 'button game-card__btn', 'Закрыть');
  btn.node.id = 'close-results';
  return resultPage.node;
};

import { ViewPath } from '../../common/constants';

const renderSprintCard = () => `
  <div class="why-us__box game-card" id="${ViewPath.SPRINT}">
    <span></span>
    <h4>Спринт</h4>
    <div class="why-us__box_img"><img src="../assets/img/why-as-box/sprint.jpg" alt="statistic"></div>
    <p>Вспоминай быстрее</p>
  </div>
`;

const renderVoiceCallCard = () => `
  <div class="why-us__box game-card" id="${ViewPath.VOICECALL}">
    <span></span>
    <h4>Аудиовызов</h4>
    <div class="why-us__box_img"><img src="../assets/img/why-as-box/savana.jpg" alt="statistic"></div>
    <p>Слушай и запоминай</p>
  </div>
`;

export { renderSprintCard, renderVoiceCallCard };

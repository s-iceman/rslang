import { ViewPath } from '../../common/constants';

const renderSprintCard = () => `
  <div class="why-us__box game-card" id="${ViewPath.SPRINT}">
    <h4>Спринт</h4>
    <div class="why-us__box_img"><img src="../assets/img/why-as-box/sprint.jpg" alt="statistic"></div>
    <span>Запоминай быстрее.</span>
  </div>
`;

const renderVoiceCallCard = () => `
  <div class="why-us__box game-card" id="${ViewPath.VOICECALL}">
    <h4>Аудиовызов</h4>
    <div class="why-us__box_img"><img src="../assets/img/why-as-box/audiocall.jpg" alt="audiocall"></div>
    <span>Играй и учись</span>
  </div>
`;

export { renderSprintCard, renderVoiceCallCard };

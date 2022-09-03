/* eslint-disable max-lines-per-function */
import { ViewPath } from '../../common/constants';

export function innerText(): string {
  return `
    <!-- ======= About Section ======= -->
    <section class="about" id="about">
    <div class="content">
        <div class="content__header">
          <img src="./assets/img/about.jpg" alt="about" class="content__img">
        </div>
        <div class="content__text">
          <h4>SpeakLang - английский это просто !</h4>
          <p>Приложение позволяет учить английские слова в 2 раза быстрее. В нашем приложении есть учебник для изучения и запоминания английских слов.
            В нем вы можете не только прочитать, но и услышать их правильное произношение.
            <a class="content__link" href='#${ViewPath.TEXTBOOK}'>Учебник</a>
          </p>
          <ul class="content__games">В нашем приложении разработаны активные игры для изучения языка
            <li><a class="content__game" href='#/${ViewPath.VOICECALL}>Аудиовызов</a></li>
            <li><a class="content__game" href='#/${ViewPath.SPRINT}>Спринт</a></li> 
          </ul>
          <p>Так же что бы получить полный доступ к функция приложения вам необходимо быть верефицированным пользователем
            <a class="content__link__reg" href="#">Пробуй!</a>
          </p>
          <p>После верефикации вам будут доступна статистика и прогресс обучения, что сделает изучение еще более увлекательным!</p>
        </div>
    </div>
  </section><!-- End About Section -->
    <!-- ======= Why Us Section ======= -->
    <section id="why-us" class="why-us">
      <div class="container-why-us">

        <div class="why-us__title">
          <h2>Why Us ?</h2>
          <p>SpeakLang является одним из лучших инструментов для изучения, повторения и запоминания английских слов.С помощью интарактивных игр и статистики вы всегда сможете тренироватся и отслеживать ваш прогесс в изучении.</p>
        </div>

        <div class="why-us__boxs">

          <div class="">
            <div class="why-us__box">
              <span></span>
              <h4>Учебник</h4>
             <a class="content__game" href='#${ViewPath.TEXTBOOK}'><div class="why-us__box_img"><img src="./assets/img/why-as-box/textbook.jpg" alt="statistic"></div></a>
             
              <p>Увеличивай свой словарь</p>
            </div>
          </div>

          <div class="">
            <div class="why-us__box">
              <span></span>
              <h4>Аудиовызов</h4>
             <a class="content__game" href='#/${ViewPath.VOICECALL}> <div class="why-us__box_img"><img src="./assets/img/why-as-box/savana.jpg" alt="audiocall"></div></a>
              <p>Слушай и запоминай</p>
            </div>
          </div>

          <div class="">
            <div class="why-us__box">
              <span></span>
              <h4>Спринт</h4>
             <a class="content__game" href='#/${ViewPath.SPRINT}> <div class="why-us__box_img"><img src="./assets/img/why-as-box/sprint.jpg" alt="spritn"></div></a>
              <p>Пробуй запоминанть быстрее.</p>
            </div>
          </div>

          <div class="">
            <div class="why-us__box">
              <span></span>
              <h4>Статистика</h4>
             <a class="content__game" href="#/statistics"> <div class="why-us__box_img"><img src="./assets/img/why-as-box/statistic.png" alt="statistic"></div></a>
              <p>Отслеживайте свой прогресс.</p>
            </div>
          </div>

        </div>

      </div>
    </section><!-- End Why Us Section -->

   

    <!-- ======= Team Section ======= -->
    <section id="team" class="team">
      <div class="container-team">

        <div class="team__title">
          <h2>Команда</h2>
          <p>Наша команда была создана на курсах RSSSCHOOL.</p>
        </div>

      <div class="team__members">
      
          <div class="team__member">
          <div class="member__img">
          <img src="./assets/img/team/team-1.jpeg" alt="member">
          </div>
          <div class="member__info">
          <div class="member__info__content">
            <h4>Okasana Zavadskaya</h4>
            <span>Team Lead</span>
            <span>what have done</span>
            <a target="_blank" href="https://github.com/s-iceman"><img src="./assets/img/GitHub-Logo.png" alt="gihub"></a>
            <div class="social">
              <a href=""><i class="twitter"></i></a>
            </div>
           </div>
          </div>

      </div>
         
      
          <div class="team__member">
          <div class="member__img">
          <img src="./assets/img/team/team-1.jpeg" alt="member">
          </div>
          <div class="member__info">
          <div class="member__info__content">
            <h4>Boris Nizameev</h4>
            <span>Programmer</span>
            <span>what have done</span>
            <a target="_blank" href="https://github.com/Boffin-ux"><img src="./assets/img/GitHub-Logo.png" alt="gihub"></a>
            <div class="social">
              <a href=""><i class="twitter"></i></a>
            </div>
           </div>
          </div>

      </div>

      
          <div class="team__member">
          <div class="member__img">
          <img src="./assets/img/team/team-1.jpeg" alt="member">
          </div>
          <div class="member__info">
          <div class="member__info__content">
            <h4>Andrei Darapiyevich</h4>
            <span>Programmer</span>
            <span>what have done</span>
            <a target="_blank" href="https://github.com/darap1"><img src="./assets/img/GitHub-Logo.png" alt="gihub"></a>
            <div class="social">
              <a href=""><i class="twitter"></i></a>
            </div>
           </div>
          </div>

      </div>

      </div>
    </section><!-- End Team Section -->
    `;
}

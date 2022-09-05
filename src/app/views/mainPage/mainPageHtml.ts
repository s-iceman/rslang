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
          <h2>SpeakLand: английский - это просто!</h2>
          <p>Приложение помогает учить английские слова в 2 раза быстрее. В нем собрано 3600 самых употребительных в повседневной жизни слов.
            <br> В нашем приложении есть <a class="content__link" href='#${ViewPath.TEXTBOOK}'>учебник</a>, в котором вы можете не только увидеть, как слово пишется, но и услышать, как оно правильно произносится.
             Каждое слово сопровождается примерами его употребления и ярким визуальным образом.
          </p>
          <ul class="content__games">В нашем приложении вы найдете игры для активного изучения языка и обогащения вашего словарного запаса:
            <a class="content__game" href='#${ViewPath.VOICECALL}'>Аудиовызов</a></li>
            <a class="content__game" href='#${ViewPath.SPRINT}'>Спринт</a></li> 
          </ul>
          <p>После <a class="content__link__reg" href="#${ViewPath.LOGIN}">регистрации</a> вам будет доступна ваша персональная статистика и прогресс обучения.
          </p>
          <p>Сделайте ваше обучение английскому языку еще более увлекательным вместе с нами!</p>
        </div>
    </div>
  </section><!-- End About Section -->
    <!-- ======= Why Us Section ======= -->
    <section id="why-us" class="why-us">
      <div class="container-why-us">

        <div class="why-us__title">
          <h2>Why Us ?</h2>
          <div class="why-us__content">
          <span> Почему мы? SpeakLand - бесплатно и без рекламы! </span>
          <p>SpeakLand является одним из аналогов популярного приложения Lingualeo для запоминания и повторения английских слов. С помощью интерактивных игр и статистики вы всегда сможете тренироватся и отслеживать ваш прогресс в изучении языка.</p>
          <p>Учите английский в любом месте с помощью компьютера или смартфона.</p>
          <p>Быстро и легко обогащайте свой словарный запас, чтобы общаться с друзьями по всему миру, путешествовать и смотреть любимые сериалы в оригинале.</p>
          <p>Преодолейте языковой барьер вместе с нами!</p>
          </div>
        </div>

        <div class="why-us__boxs">
          <div class="">
            <div class="why-us__box">
              <h4>Учебник</h4>
              <a class="content__game" href='#${ViewPath.TEXTBOOK}'><div class="why-us__box_img"><img src="./assets/img/why-as-box/textbook.jpg" alt="textbook"></div></a>
              <span>Увеличивай свой словарь</span>
            </div>
          </div>

          <div class="">
            <div class="why-us__box">
              <h4>Аудиовызов</h4>
              <a class="content__game" href='#${ViewPath.VOICECALL}'> <div class="why-us__box_img"><img src="./assets/img/why-as-box/audiocall.jpg" alt="audiocall"></div></a>
              <span>Слушай и запоминай</span>
            </div>
          </div>

          <div class="">
            <div class="why-us__box">
              <h4>Спринт</h4>
              <a class="content__game" href='#${ViewPath.SPRINT}'> <div class="why-us__box_img"><img src="./assets/img/why-as-box/sprint.jpg" alt="sprint"></div></a>
              <span>Пробуй запоминать быстрее.</span>
            </div>
          </div>

          <div class="">
            <div class="why-us__box">
              <h4>Статистика</h4>
              <a class="content__game" href='#${ViewPath.STATISTICS}'> <div class="why-us__box_img"><img src="./assets/img/why-as-box/statistics.jpg" alt="statistics"></div></a>
              <span>Отслеживайте свой прогресс.</span>
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
          <img src="./assets/img/team/team-1.jpg" alt="member">
          </div>
          <div class="member__info">
          <div class="member__info__content">
            <h5>Team Lead</h5>
            <h4>Okasana Zavadskaya</h4>
            <ul>
              <li><span>Общая структура приложения</span></li>
              <li><span>Общие компоненты для игр</span></li>
              <li><span>Электронный учебник</span></li>
              <li><span>Игра Спринт</span></li>
              <li><span>Статистика</span></li>
            </ul>
           </div>
           <div class="social">
              <a target="_blank" href="https://github.com/s-iceman"><img src="./assets/img/GitHub-Logo.png" alt="gihub"></a>
            </div>
          </div>

      </div>
         
      
          <div class="team__member">
          <div class="member__img">
          <img src="./assets/img/team/team-1.jpg" alt="member">
          </div>
          <div class="member__info">
          <div class="member__info__content">
            <h5>Programmer</h5> 
            <h4>Boris Nizameev</h4>
             <ul>
               <li><span>Список слов</span></li>
               <li><span>Прогресс изучения</span></li>
               <li><span>Изученные слова</span></li>
                <li><span>Стилизация игр</span></li>
                <li><span>Деплой бэкенда</span></li>
            </ul>
           </div>
           <div class="social">
            <a target="_blank" href="https://github.com/Boffin-ux"><img src="./assets/img/GitHub-Logo.png" alt="gihub"></a>
            </div>
          </div>

      </div>

      
          <div class="team__member">
          <div class="member__img">
          <img src="./assets/img/team/team-1.jpg" alt="member">
          </div>
          <div class="member__info">
          <div class="member__info__content">
           <h5>Programmer</h5> 
            <h4>Andrei Darapiyevich</h4>
             <ul>
               <li><span>Главная страница приложения</span></li>
               <li><span>Авторизация</span></li>
               <li><span>Игра Аудиовызов</span></li>
               <li><span>Стилизация приложения</span></li>
            </ul>
           </div>
            <div class="social">
              <a target="_blank" href="https://github.com/darap1"><img src="./assets/img/GitHub-Logo.png" alt="gihub"></a>
            </div>
          </div>

      </div>

      </div>
    </section><!-- End Team Section -->
    `;
}

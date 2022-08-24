//import { PageIds } from '../../../pages/app';
import Component from '../components/components'
import './header.css'

class Header extends Component {
  constructor(tagName: string, className: string, id?:string) {
    super(tagName, className,id);
  }

  render() {
    this.container.innerHTML =`
    <div class='container'>
      <div class="header__body">
        <a class="header__logo" href="#" class="header__logo">
          SPEAKLAND
         </a>
         <div class="header__burger">
          <span></span>
         </div>
         <nav class="header__menu">
         <ul class="header__list">
           <li><a class="header__link active" href="#">Главная</a></li>
           <li><a class="header__link" href="textbook">Учебник</a></li>
           <li><div class="dropdown">
                <button class="dropbtn">ИГРЫ</button>
                  <div class="dropdown_content">
                     <a href="#">Савана</a>
                     <a href="#">Спринт</a>
                  </div>
              </div>
           </li>
           <li><a class="header__link" href="#">Статистика</a></li>
           <li><a class="header__link" href="#about">О приложении</a></li>
           <li><a class="header__link" href="#team">О команде</a></li>
           <li><a class="header__link login" href="#">Login</a></li>
         </ul>
        </nav>
       </div>
    </div>
  `
  document.body.addEventListener('click',function(event){
    const eventTarget = event!.target! as HTMLButtonElement;
    if (eventTarget.classList.contains('header__burger')) {
    eventTarget.classList.toggle('active')
    const menu = document.getElementsByClassName('header__menu') as HTMLCollection;
    menu[0].classList.toggle('active');
    }
    
  })
    
    return this.container;
  }
}

export default Header;

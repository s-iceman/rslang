import { PageIds } from '../../../pages/app';
import Component from '../../templates/components';
import './footer.css'

class Footer extends Component {
  constructor(tagName: string, className: string, id?:string) {
    super(tagName, className,id);
  }

  render() {
    this.container.innerHTML =`
    <div class='container'>
      <div class="footer__body">
      <div class="footer__rsshool_img"></div>
      <div class="contacts">           
      <h3 class="contacts__title">GitHub of project</h3>
         <a href="https://github.com/s-iceman/rslang"  class="rslang">
         <p class="gitHub">SpeakLang</p></a>
   </div>
       </div>
    </div>
  `
//   document.body.addEventListener('click',function(event){
//     const eventTarget = event!.target! as HTMLButtonElement;
//     if (eventTarget.classList.contains('footer__burger')) {
//     eventTarget.classList.toggle('active')
//     const menu = document.getElementsByClassName('footer__menu') as HTMLCollection;
//     menu[0].classList.toggle('active');
//     }
    
//   })
    
    return this.container;
  }
}

export default Footer;

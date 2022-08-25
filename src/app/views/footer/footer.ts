//import { PageIds } from '../../../pages/app';
import Component from '../components/components'
import './footer.css'

class Footer extends Component {
  constructor(tagName: string, className: string, id?:string) {
    super(tagName, className,id);
  }

  render() {
    this.container.innerHTML =`
    <div class='container'>
      <div class="footer__body">
      <div class="footer__rsshool_img">
      <a target="_blank" href="https://rs.school/"><img src="../assets/img/rs_school.jpg" alt="rs_school"></a></div>
      <div class="contacts">           
      <h3 class="contacts__title">GitHub of project</h3>
         <a href="https://github.com/s-iceman/rslang"  class="rslang">
         <p class="gitHub">SpeakLang</p></a>
   </div>
       </div>
    </div>
  ` 
    return this.container;
  }
}

export default Footer;

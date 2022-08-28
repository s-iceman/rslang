import Component from '../components/components';

class Footer extends Component {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(tagName: string, className: string, id?: string) {
    super(tagName, className, id);
  }

  render() {
    this.container.innerHTML = `
    <div class='container'>
      <div class="footer__body">
      <div class="footer__rsshool_img">
      <a target="_blank" href="https://rs.school/"><img src="./assets/img/rs_school.jpg" alt="rs_school"></a></div>
      <div class="footer__members">
        <img src="./assets/img/gitHubWhite.jpg" alt="gihub" class="footer__git-img"">
        <div class="footer__members_git-hub">
        <a target="_blank" href="https://github.com/s-iceman">Oksana Zavadskaya</a>
        <a target="_blank" href="https://github.com/darap1">Andrei Darapiyevich</a>
        <a target="_blank" href="https://github.com/Boffin-ux">Boris Nizameev</a>
        </div>
      </div> 
      <div class="contacts__project">       
      <h3 class="contacts__project__title">GitHub of project:</h3>
          <a href="https://github.com/s-iceman/rslang"  class="rslang">
          <p class="gitHub">SpeakLang</p></a>
      </div>
      <div class="footer__copyright">©<span>2022 RSLang</span></div>
        </div>
    </div>
  `;
    return this.container;
  }
}

export default Footer;

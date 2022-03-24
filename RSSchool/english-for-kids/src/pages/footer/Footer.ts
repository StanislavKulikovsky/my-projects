import { addElem } from '../../commonFuncs/CommonFuncs';
import './Footer.scss';

export class Footer {
  elem: HTMLElement;

  constructor() {
    this.elem = addElem('footer', 'footer', document.body);
  }

  add(): void {
    this.elem.innerHTML = `<a href="https://github.com/Pabizolka">by Pabizolka</a>
    2021
    <a href="https://rs.school/js/"><img class="icon-rss" src="./icons/rs_school_js.svg" alt=""></a>`;
  }
}

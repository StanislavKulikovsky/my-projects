import { addElem } from '../../commonFuncs/CommonFuncs';
import { globalVars } from '../../globalVars/globalVars';
import './Header.scss';

export class Header {
  elem: HTMLElement;

  buttonHamburger: HTMLElement;

  buttonSwitchMode: HTMLElement;

  buttonStart: HTMLElement;

  textSwitchMode: HTMLElement;

  constructor() {
    this.elem = addElem('header', 'header', document.body);
    const topWrapper = addElem('div', 'top-wrapper', this.elem);
    const middleWrapper = addElem('div', 'middle-wrapper', this.elem);
    globalVars.starContainer = addElem('div', 'bottom-wrapper', this.elem);
    this.buttonHamburger = addElem('div', 'hamburger', topWrapper);
    addElem('span', '', this.buttonHamburger, '');
    this.buttonHamburger.onclick = () => {
      this.buttonHamburger.classList.toggle('is-active');
    };

    this.buttonStart = addElem('div', 'button-start', addElem('div', 'button-start-container', topWrapper), 'START');

    globalVars.pageNameElem = addElem('div', 'header-text', middleWrapper, 'Main Page');
    this.buttonSwitchMode = addElem('div', 'switch-mode', topWrapper);
    addElem('div', 'switch-circle', this.buttonSwitchMode);
    this.textSwitchMode = addElem('div', 'switch-text', this.buttonSwitchMode, 'train');
  }
}

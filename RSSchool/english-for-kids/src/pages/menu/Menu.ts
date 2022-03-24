import cardsBase from '../../cardsBase/CardsBase';
import { addElem } from '../../commonFuncs/CommonFuncs';
import { globalVars } from '../../globalVars/globalVars';
import './Menu.scss';

export class Menu {
  elem: HTMLElement;

  active = false;

  items: { item: HTMLElement; name: string }[] = [];

  buttonLoginContainer: HTMLElement;

  list: HTMLElement;

  constructor(public buttonHamburger: HTMLElement, public header: HTMLElement) {
    this.elem = document.createElement('div');
    header.prepend(this.elem);
    this.elem.className = 'menu';

    this.list = addElem('ul', '', this.elem);

    this.createItem('Main Page', '#', '#');
    cardsBase.Categories.forEach((el) => {
      this.createItem(el.name, el.name, `#/categories/${el.name}`);
    });
    this.createItem('Statistic', 'statistic', '#/statistic').classList.add('item-stats');

    this.buttonLoginContainer = addElem('div', 'button-login-container', this.elem);
    addElem('div', 'button-login', this.buttonLoginContainer, 'Login');

    buttonHamburger.onclick = () => {
      if (this.active) {
        this.remove();
      } else {
        this.add();
      }
    };
  }

  createItem(text: string, name: string, link: string): HTMLElement {
    const item = addElem('li', '', this.list);
    const linkElem = document.createElement('a');
    linkElem.className = 'menu-link';
    linkElem.textContent = text;
    linkElem.href = link;
    item.appendChild(linkElem);
    this.items.push({ item, name });
    return item;
  }

  changeMenuItem(): void {
    globalVars.wrongHash = true;

    this.items.forEach((elem) => {
      if (`#/categories/${elem.name}` === window.location.hash.replace(/%20/g, ' ')) {
        globalVars.wrongHash = false;
        if (!elem.item.classList.contains('is-active')) {
          elem.item.classList.add('is-active');
        }
      } else if (elem.item.classList.contains('is-active')) {
        elem.item.classList.remove('is-active');
      }
    });

    if (window.location.hash === '#/statistic') {
      globalVars.wrongHash = false;
      this.items[this.items.length - 1].item.classList.add('is-active');
    }

    if (globalVars.wrongHash) {
      window.location.hash = '#';
    }
    if (window.location.hash === '' || window.location.hash === '#') {
      this.items[0].item.classList.add('is-active');
    }
    globalVars.wrongHash = false;
  }

  add(): void {
    this.buttonHamburger.classList.add('is-active');
    this.elem.classList.add('is-active');
    this.active = true;
    setTimeout(() => {
      document.onclick = (event) => {
        if (event.target !== this.elem && event.target !== this.buttonLoginContainer && event.target !== this.list) {
          this.remove();
        }
      };
    }, 100);
  }

  remove(): void {
    this.buttonHamburger.classList.remove('is-active');
    this.elem.classList.remove('is-active');
    this.active = false;
    document.onclick = () => {};
  }
}

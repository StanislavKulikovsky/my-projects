import { addElem } from './baseFuctions';

export class PageSelector {
  garPage: HTMLElement;

  winPage: HTMLElement;

  constructor(garPage: HTMLElement, winPage: HTMLElement) {
    this.garPage = garPage;
    this.winPage = winPage;
  }

  createInner(): void {
    const elem = addElem('div', 'page-selector', document.body);
    document.body.prepend(elem);
    addElem('div', 'button _button-green _disable', elem, 'to garage');
    addElem('div', 'button _button-green', elem, 'to winners');

    elem.addEventListener('click', (event: MouseEvent) => {
      if (event.target instanceof Element) {
        if (event.target.className === 'button _button-green') {
          if (event.target.textContent === 'to garage') {
            this.winPage.remove();
            document.body.appendChild(this.garPage);
          } else {
            this.garPage.remove();
            document.body.appendChild(this.winPage);
          }
          elem.querySelectorAll('.button').forEach((el) => {
            el.className = 'button _button-green';
          });
          event.target.classList.add('_disable');
        }
      }
    });
  }
}

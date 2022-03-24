import { WebElement } from './common';

export class Logo implements WebElement {
  parent: HTMLElement;

  element = document.createElement('div');

  cssClass = 'logo';

  constructor(parent: WebElement) {
    this.parent = parent.element;
  }

  addElement(): void {
    const fragment1 = document.createElement('div');
    const fragment2 = document.createElement('div');
    const textFragment1 = document.createElement('p');
    const textFragment2 = document.createElement('p');
    this.element.className = this.cssClass;
    fragment1.className = 'logo-fragment1';
    fragment2.className = 'logo-fragment2';
    textFragment1.innerHTML = 'match';
    textFragment2.innerHTML = 'match';
    fragment1.appendChild(textFragment1);
    fragment2.appendChild(textFragment2);
    this.element.appendChild(fragment1);
    this.element.appendChild(fragment2);
    this.parent.appendChild(this.element);
  }
}

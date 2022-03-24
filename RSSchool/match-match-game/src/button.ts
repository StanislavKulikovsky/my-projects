import { WebElement } from './common';

export class Button implements WebElement {
  parent: HTMLElement;

  element = document.createElement('div');

  content: string;

  cssClass: string;

  constructor(content: string, cssClass: string, parent: HTMLElement = document.body) {
    this.content = content;
    this.cssClass = cssClass;
    this.parent = parent;
  }

  addElement(): void {
    this.element.className = this.cssClass;
    this.element.textContent = this.content;
    this.parent.appendChild(this.element);
  }
}

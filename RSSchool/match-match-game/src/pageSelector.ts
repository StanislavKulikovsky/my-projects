import { Button } from './button';
import { CommonWebElement, WebElement } from './common';

export class PageSelector implements WebElement {
  parent: HTMLElement;

  element = document.createElement('div');

  btnArray: Array<Button> = [];

  cssClass = 'page-selector';

  constructor(parent: WebElement, btn0: Button, btn1: Button, btn2: Button) {
    this.parent = parent.element;
    this.btnArray.push(btn0);
    this.btnArray.push(btn1);
    this.btnArray.push(btn2);
  }

  addElement(): void {
    this.element.className = this.cssClass;
    this.btnArray.forEach((elem) => {
      elem.parent = this.element;
      elem.addElement();
    });
    this.parent.appendChild(this.element);
  }

  updateActivePageButton(currentPageKey: string): void {
    this.btnArray.forEach((elem) => {
      if (elem.element.classList.contains('active')) {
        elem.element.classList.remove('active');
      }
      if (elem.content === currentPageKey && !elem.element.classList.contains('active')) {
        elem.element.classList.add('active');
      }
    });
  }
}

export function changePage(
  btn: Button,
  gameInfo: { deleted: boolean },
  root: { pageMain: CommonWebElement },
  pageSelector: PageSelector,
  deleted: boolean,
): void {
  gameInfo.deleted = deleted;
  root.pageMain.element.remove();
  pageSelector.updateActivePageButton(btn.content);
}

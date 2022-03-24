export interface WebElement {
  parent: HTMLElement;
  element: HTMLElement;
  cssClass: string;
  addElement(): void;
}

export class CommonWebElement implements WebElement {
  parent: HTMLElement = document.body;

  element: HTMLElement;

  cssClass: string;

  constructor(type: string, cssClass: string) {
    this.element = document.createElement(type);
    this.cssClass = cssClass;
  }

  addElement(): void {
    this.element.className = this.cssClass;
    this.parent.appendChild(this.element);
  }
}

export function createElem(type: string, classname: string, parent: HTMLElement): HTMLElement {
  const elem = document.createElement(type);
  elem.className = classname;
  parent.appendChild(elem);
  return elem;
}
export function createInput(
  parent: HTMLElement,
  type: string,
  className: string,
  id = '',
  maxLength = 1,
): HTMLInputElement {
  const element = document.createElement('input');
  element.type = type;
  element.id = id;
  element.maxLength = maxLength;
  element.className = className;
  parent.appendChild(element);
  return element;
}

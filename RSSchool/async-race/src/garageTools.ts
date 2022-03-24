import { addElem } from './baseFuctions';

export class Tools {
  elem: HTMLElement;

  inputCreateText: HTMLInputElement;

  inputCreateColor: HTMLInputElement;

  inputUpdateText: HTMLInputElement;

  inputUpdateColor: HTMLInputElement;

  buttonUpdate: HTMLElement;

  buttonRace: HTMLElement;

  buttonReset: HTMLElement;

  constructor(elem: HTMLElement) {
    this.elem = elem;
    this.inputCreateText = document.createElement('input');
    this.inputCreateText.type = 'text';
    this.inputCreateColor = document.createElement('input');
    this.inputCreateColor.type = 'color';
    this.inputUpdateText = document.createElement('input');
    this.inputUpdateText.type = 'text';
    this.inputUpdateColor = document.createElement('input');
    this.inputUpdateColor.type = 'color';
    this.inputCreateText.className = 'input-text input-text-new';
    this.inputUpdateText.className = 'input-text input-text-upd _disable';
    this.inputCreateColor.className = 'input-color input-color-new';
    this.inputUpdateColor.className = 'input-color input-color-upd _disable';
    elem.appendChild(this.inputCreateText);
    elem.appendChild(this.inputCreateColor);
    addElem('div', 'button _button-gray', elem, 'create');
    elem.appendChild(this.inputUpdateText);
    elem.appendChild(this.inputUpdateColor);
    this.buttonUpdate = addElem('div', 'button-update button _button-gray _disable', elem, 'update');
    this.buttonRace = addElem('div', 'button _button-green', elem, 'race');
    this.buttonReset = addElem('div', 'button _button-green _disable', elem, 'reset');
    addElem('div', 'button _button-gray', elem, 'generate cars');
  }

  disableUpdateTool(): void {
    if (!this.buttonUpdate.classList.contains('_disable')) {
      this.inputUpdateText.value = '';
      this.inputUpdateColor.value = '#000000';
      this.inputUpdateText.classList.add('_disable');
      this.inputUpdateColor.classList.add('_disable');
      this.buttonUpdate.classList.add('_disable');
    }
  }
}

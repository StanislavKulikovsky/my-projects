import { addElem, createCarSvg } from './baseFuctions';

export class CarsItem {
  item: HTMLElement;

  name: string;

  color: string;

  id: number;

  tools: HTMLElement;

  svg: SVGElement;

  buttonStart: HTMLElement;

  buttonStop: HTMLElement;

  constructor(list: HTMLElement, name: string, color: string, id: number) {
    this.color = color;
    this.name = name;
    this.id = id;
    this.item = addElem('div', 'cars-list_item', list);
    this.tools = addElem('div', 'list_item-tools', this.item);
    this.tools.innerHTML = `<div class="button _button-gray">select</div>
    <div class="button _button-gray">remove</div>`;
    this.buttonStart = addElem('div', 'button _button-green', this.tools, 'start');
    this.buttonStop = addElem('div', 'button _button-green _disable', this.tools, 'stop');
    addElem('div', 'car-name', this.item, name);
    const track = addElem('div', 'track', this.item);
    addElem('div', 'finish', track);
    this.svg = createCarSvg(color, track, 'car-svg');
  }
}

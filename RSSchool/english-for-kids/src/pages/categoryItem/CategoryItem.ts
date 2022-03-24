import { addElem } from '../../commonFuncs/CommonFuncs';
import './CategoryItem.scss';

export class CategoryItem {
  elem: HTMLElement;

  constructor(public name: string, imageSrc: string, parent: HTMLElement) {
    this.elem = addElem('div', 'category-item', parent);
    const img = addElem('div', 'category-image', this.elem);
    img.style.backgroundImage = `url('${imageSrc}')`;
    addElem('div', 'category-text', this.elem, name);
  }

  addActivity(): void {
    this.elem.onclick = () => {
      window.location.hash = `#/categories/${this.name}`;
    };
  }
}

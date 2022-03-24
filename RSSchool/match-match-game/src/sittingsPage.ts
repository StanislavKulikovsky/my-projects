import { CommonWebElement, createElem } from './common';

function createSelector(
  parent: HTMLElement,
  options: Array<string>,
  def: string,
  obj: { collection: string; difficulty: string },
  key: string,
): HTMLElement {
  const select = document.createElement('select');
  select.className = 'sittings-select';
  parent.appendChild(select);
  switch (key) {
    case 'collection':
      select.onchange = () => {
        obj.collection = select.value;
      };
      break;
    case 'difficulty':
      select.onchange = () => {
        obj.difficulty = select.value;
      };
      break;
    default:
      break;
  }

  options.forEach((option) => {
    const elem = document.createElement('option');
    elem.value = option;
    elem.textContent = option;
    select.appendChild(elem);
  });
  select.value = def;
  return select;
}

export function createSittingsPage(currentSittings: { collection: string; difficulty: string }): CommonWebElement {
  const main = new CommonWebElement('div', 'main-sittings');
  main.addElement();
  const form = createElem('form', 'sittings-form', main.element);

  const label1 = createElem('label', 'sittings-label', form);
  label1.textContent = 'Cards collection';
  createSelector(form, ['animals', 'baby', 'medicine', 'wedding'], 'animals', currentSittings, 'collection');

  const label2 = createElem('label', 'sittings-label', form);
  label2.textContent = 'Game difficulty';
  createSelector(form, ['low (4x4)', 'medium (6x6)', 'high (8x8)'], 'low (4x4)', currentSittings, 'difficulty');

  currentSittings.collection = 'animals';
  currentSittings.difficulty = 'low (4x4)';

  return main;
}

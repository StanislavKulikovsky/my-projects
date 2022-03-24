import { CommonWebElement, createElem } from './common';
import { getTop } from './dbFunctions';

export function createBest(root: { pageMain: CommonWebElement }): void {
  root.pageMain = new CommonWebElement('div', 'main');
  root.pageMain.addElement();
  const heading = createElem('h2', 'h2', root.pageMain.element);
  heading.textContent = 'Best players';
  const table = createElem('div', 'best-table', root.pageMain.element);
  getTop(table);
}

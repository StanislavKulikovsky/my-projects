export function addElem(tag: string, className: string, parent: HTMLElement, textContent = ''): HTMLElement {
  const elem = document.createElement(tag);
  elem.className = className;
  elem.textContent = textContent;
  parent.appendChild(elem);
  return elem;
}

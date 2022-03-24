export function addClass(element: HTMLElement, classname: string): void {
  if (!element.classList.contains(classname)) {
    element.classList.add(classname);
  }
}

export function removeClass(element: HTMLElement, classname: string): void {
  if (element.classList.contains(classname)) {
    element.classList.remove(classname);
  }
}

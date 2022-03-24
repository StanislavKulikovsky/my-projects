import { createElem } from './common';

export function addPositions(
  players: { firstName: string; lastName: string; email: string; img64: string; result: number }[],
  parent: HTMLElement,
): void {
  players.forEach((player) => {
    const row = createElem('div', 'best-row', parent);
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    canvas.className = 'best-icon';
    const context = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      if (context) {
        context.drawImage(img, 0, 0, 40, 40);
      }
    };
    img.src = player.img64;
    row.appendChild(canvas);

    const personal = createElem('div', 'best-personal', row);
    const name = createElem('div', 'best-personal-name', personal);
    name.textContent = `${player.firstName} ${player.lastName}`;
    const email = createElem('div', 'best-personal-email', personal);
    email.textContent = player.email;

    const result = createElem('div', 'best-result', row);
    result.textContent = `Score: ${player.result}`;
  });
}

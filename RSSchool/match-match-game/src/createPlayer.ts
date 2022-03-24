import { Button } from './button';
import { CommonWebElement, createElem } from './common';
import { createGame } from './createGame';
import { updateStartButton } from './images/startButton';
import { PageSelector } from './pageSelector';

export function createPlayer(
  player: {
    firstName: string;
    lastName: string;
    email: string;
    img64: string;
    result: number;
  },
  bg: HTMLElement,
  firstName: string,
  lastName: string,
  email: string,
  buttonRegister: Button,
  header: CommonWebElement,

  gameInfo: {
    id: string;
    currentCard: HTMLElement;
    pairs: number;
    count: number;
    disabled: boolean;
    time: number;
    deleted: boolean;
    bads: number;
  },
  root: { pageMain: CommonWebElement },
  currentSittings: { difficulty: string; collection: string },
  pageSelector: PageSelector,
  btnBest: Button,
): void {
  bg.remove();

  player.firstName = firstName;
  player.lastName = lastName;
  player.email = email;

  if (buttonRegister.element.classList.contains('button-register')) {
    const container = createElem('div', 'start-button-container', header.element);
    const btnStart = createElem('div', 'button-start', container);
    btnStart.textContent = 'start game';
    btnStart.id = 'enable';
    btnStart.onclick = () => {
      if (btnStart.id === 'enable') {
        btnStart.id = 'disable';
        if (gameInfo.deleted === true) {
          root.pageMain.element.remove();
          root.pageMain.element = createGame(gameInfo, currentSittings, player, root, btnBest, pageSelector);
          gameInfo.deleted = false;
          updateStartButton(gameInfo);
          pageSelector.updateActivePageButton('');
          setTimeout(() => {
            btnStart.id = 'enable';
          }, 1200);
        } else {
          root.pageMain.element.remove();
          gameInfo.deleted = true;
          updateStartButton(gameInfo);
          setTimeout(() => {
            btnStart.id = 'enable';
          }, 1200);
        }
      }
    };

    container.appendChild(buttonRegister.element);
    buttonRegister.element.textContent = '';
    buttonRegister.element.className = 'button-register-analog';
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    buttonRegister.element.appendChild(canvas);
  }
  const canvas = buttonRegister.element.querySelector('canvas');
  if (canvas) {
    const context = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      if (context) {
        context.drawImage(img, 0, 0, 40, 40);
      }
    };
    img.src = player.img64;
  }
}

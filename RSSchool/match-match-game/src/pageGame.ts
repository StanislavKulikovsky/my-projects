import { Button } from './button';
import { CommonWebElement, createElem } from './common';
import { addResultat } from './dbFunctions';
import { updateStartButton } from './images/startButton';
import { createBest } from './pageBest';
import { changePage, PageSelector } from './pageSelector';

export function createCard(
  rows: string,
  parent: HTMLElement,
  id: string,
  gameInfo: {
    id: string;
    currentCard: HTMLElement;
    pairs: number;
    count: number;
    disabled: boolean;
    time: number;
    bads: number;
    deleted: boolean;
  },
  player: {
    firstName: string;
    lastName: string;
    email: string;
    img64: string;
    result: number;
  },
  timer: NodeJS.Timeout,
  collection: string,
  root: { pageMain: CommonWebElement },
  btnBest: Button,
  pageSelector: PageSelector,
): HTMLElement {
  const card = createElem('div', `card card-${rows}`, parent);
  card.id = id;
  const flipper = createElem('div', 'flipper', card);
  createElem('div', `front card-${rows}`, flipper);
  const back = createElem('div', `back card-${rows}`, flipper);
  back.style.backgroundImage = `url('./images/collections/${collection}/${id}.png')`;
  card.onclick = () => {
    if (!card.classList.contains('open') && !gameInfo.disabled) {
      card.classList.add('open');
      if (gameInfo.id) {
        if (gameInfo.id === id) {
          gameInfo.disabled = true;
          setTimeout(() => {
            createElem('div', 'green-mask', card);
            createElem('div', 'green-mask', gameInfo.currentCard);
            gameInfo.disabled = false;
          }, 400);
          gameInfo.count++;
          if (gameInfo.pairs === gameInfo.count) {
            // win
            clearInterval(timer);
            setTimeout(() => {
              player.result = (gameInfo.pairs - gameInfo.bads) * 100 - gameInfo.time * 10;
              if (player.result < 0) {
                player.result = 0;
              }
              addResultat(player);
              const bg = createElem('div', 'modal-bg', document.body);
              bg.addEventListener('click', (elem) => {
                if (elem.target === bg) {
                  bg.remove();
                  root.pageMain.element.remove();
                  gameInfo.deleted = true;
                  updateStartButton(gameInfo);
                  changePage(btnBest, gameInfo, root, pageSelector, true);
                  createBest(root);
                  updateStartButton(gameInfo);
                }
              });
              const modal = createElem('div', 'congrats', bg);
              const text = createElem('p', 'congrats-text', modal);
              text.textContent = `Congratulations! You successfully found all matches on ${Math.floor(
                gameInfo.time / 60,
              )}.${gameInfo.time > 9 ? gameInfo.time % 60 : `0${gameInfo.time % 60}`} minutes.`;
              const button = createElem('div', 'congrats-button', modal);
              button.textContent = 'OK';
              button.onclick = () => {
                bg.remove();
                root.pageMain.element.remove();
                gameInfo.deleted = true;
                updateStartButton(gameInfo);
                updateStartButton(gameInfo);
                changePage(btnBest, gameInfo, root, pageSelector, true);
                createBest(root);
                updateStartButton(gameInfo);
              };
            }, 1000);
          }
        } else {
          let mask1: HTMLElement;
          let mask2: HTMLElement;
          setTimeout(() => {
            mask1 = createElem('div', 'red-mask', card);
            mask2 = createElem('div', 'red-mask', gameInfo.currentCard);
            gameInfo.bads++;
          }, 400);
          gameInfo.disabled = true;
          setTimeout(() => {
            card.classList.remove('open');
            mask1.remove();
            gameInfo.currentCard.classList.remove('open');
            mask2.remove();
            gameInfo.disabled = false;
          }, 1000);
        }
        gameInfo.id = '';
      } else {
        gameInfo.id = id;
        gameInfo.currentCard = card;
      }
    }
  };
  return card;
}

export function createRandomArray(numPairs: number): number[] {
  const arr: number[] = [];
  const res: number[] = [];
  for (let i = 0; i < numPairs * 2; i++) {
    arr.push(Math.floor(i / 2));
  }
  for (let i = 0; i < numPairs * 2; i++) {
    const j = Math.floor(Math.random() * arr.length);
    res.push(arr[j]);
    arr.splice(j, 1);
  }
  return res;
}

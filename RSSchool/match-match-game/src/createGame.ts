import { Button } from './button';
import { CommonWebElement, createElem } from './common';
import { createCard, createRandomArray } from './pageGame';
import { PageSelector } from './pageSelector';

export function createGame(
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
  currentSittings: { difficulty: string; collection: string },
  player: {
    firstName: string;
    lastName: string;
    email: string;
    img64: string;
    result: number;
  },
  root: { pageMain: CommonWebElement },
  btnBest: Button,
  pageSelector: PageSelector,
): HTMLElement {
  const rows = currentSittings.difficulty.slice(-2, -1);
  gameInfo.pairs = Number(rows) ** 2 / 2;
  gameInfo.count = 0;
  gameInfo.bads = 0;
  gameInfo.time = -30;
  const main = createElem('div', 'main', document.body);
  const timeDiv = createElem('div', 'timer', main);
  const timeText = createElem('p', 'timer-text', timeDiv);
  const bar = createElem('div', 'timer-bar', timeDiv);
  bar.style.backgroundColor = '#00ff0088';
  const timer = setInterval(() => {
    gameInfo.time++;
    const sec = gameInfo.time > 9 ? gameInfo.time % 60 : `0${gameInfo.time % 60}`;
    timeText.textContent = gameInfo.time < 0 ? '0:00' : `${Math.floor(gameInfo.time / 60)}:${sec}`;
    if (gameInfo.deleted) {
      clearInterval(timer);
    }
    if (gameInfo.time <= 0) {
      bar.style.width = `${Math.floor((256 / 30) * -gameInfo.time)}px`;
      if (gameInfo.time > -10) {
        bar.style.backgroundColor = '#ff000088';
      }
    }
  }, 1000);
  const container = createElem('div', 'card-container', main);
  const array = createRandomArray(gameInfo.pairs);
  const cards: HTMLElement[] = [];
  gameInfo.disabled = true;
  for (let i = 0; i < gameInfo.pairs * 2; i++) {
    cards.push(
      createCard(
        rows,
        container,
        String(array[i]),
        gameInfo,
        player,
        timer,
        currentSittings.collection,
        root,
        btnBest,
        pageSelector,
      ),
    );
    cards[i].classList.add('open');
  }
  setTimeout(() => {
    for (let i = 0; i < gameInfo.pairs * 2; i++) {
      cards[i].classList.remove('open');
    }
    gameInfo.disabled = false;
  }, 30000);
  return main;
}

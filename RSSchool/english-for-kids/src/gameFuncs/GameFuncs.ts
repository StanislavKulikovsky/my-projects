import { addElem } from '../commonFuncs/CommonFuncs';
import { globalVars } from '../globalVars/globalVars';

import './GameFuncs.scss';

export class GameFuncs {
  static nextCard(): void {
    const cardTemp = globalVars.cardsArray.shift();
    if (cardTemp) {
      globalVars.currentCard = cardTemp;
    } else {
      this.completeGame();
    }
    setTimeout(() => {
      cardTemp?.playSound();
    }, 500);
  }

  static completeGame(): void {
    this.addBanner();
    setTimeout(() => {
      this.removeBanner();
      window.location.hash = '#';
    }, 5000);
  }

  static addStar(correct: boolean): void {
    if (correct) {
      const star = addElem('div', 'star-correct', globalVars.starContainer);
      globalVars.starContainer.prepend(star);
    } else {
      const star = addElem('div', 'star-wrong', globalVars.starContainer);
      globalVars.starContainer.prepend(star);
    }
  }

  static resetGame(): void {
    globalVars.starContainer.innerHTML = '';
    globalVars.gameStarted = false;
  }

  static addBanner(): void {
    globalVars.bannerElem = addElem('div', 'banner-container', document.body);
    if (globalVars.counterMistakes > 0) {
      globalVars.bannerElem.classList.add('lose');
      addElem('p', 'text-mistakes', globalVars.bannerElem, `Mistakes: ${globalVars.counterMistakes}`);
      globalVars.audioFailure.play();
    } else {
      globalVars.bannerElem.classList.add('win');
      globalVars.audioSucces.play();
    }
  }

  static removeBanner(): void {
    globalVars.bannerElem.remove();
  }
}

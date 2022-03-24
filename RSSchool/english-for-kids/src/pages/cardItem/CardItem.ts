import { addElem } from '../../commonFuncs/CommonFuncs';
import { GameFuncs } from '../../gameFuncs/GameFuncs';
import { globalVars } from '../../globalVars/globalVars';
import './CardItem.scss';
import { ICardItem } from './ICardItem';

export class CardItem implements ICardItem {
  elem: HTMLElement;

  wordTranlation: string;

  text: HTMLElement;

  swapped = false;

  swapper: HTMLElement;

  cardContainer: HTMLElement;

  guard: HTMLElement;

  audio: HTMLAudioElement;

  sortedBy = '';

  constructor(public word: string, translation: string, imageSrc: string, audioSrc: string, parent: HTMLElement) {
    this.cardContainer = addElem('div', 'card-container', parent);
    this.elem = addElem('div', 'card-item', this.cardContainer);
    this.wordTranlation = translation;
    this.audio = new Audio(audioSrc);
    const img = addElem('div', 'card-image', this.elem);
    img.style.backgroundImage = `url('${imageSrc}')`;
    this.text = addElem('div', 'card-text', this.elem, word);
    this.swapper = addElem('div', 'card-swap', this.elem);
    this.guard = addElem('div', 'guard', this.elem);

    if (globalVars.activePlayMode) {
      this.elem.classList.add('is-active');
      this.text.textContent = 'play';
    }

    this.addCardClickListener();
  }

  private addCardClickListener(): void {
    this.elem.addEventListener('click', (event) => {
      if (event.target === this.swapper) {
        this.swapCard();
      } else if (!globalVars.activePlayMode && !this.swapped) {
        this.playWordEvent();
      } else if (globalVars.gameStarted) {
        this.chooseWordEvent(event.target);
      }
    });
  }

  swapCard(): void {
    if (this.swapped) {
      this.removeSwapped();
    } else {
      this.addSwapped();
    }
  }

  playWordEvent(): void {
    this.playSound();

    const baseObj: {
      categories: {
        name: string;
        cards: { word: string; translation: string; click: number; guesses: number; mistakes: number }[];
      }[];
    } = JSON.parse(localStorage.cardBase);
    baseObj.categories.forEach((categ) => {
      if (categ.name === globalVars.currentCategoryObj.name) {
        categ.cards.forEach((card) => {
          if (card.word === this.word) {
            card.click++;
          }
        });
      }
    });
    localStorage.cardBase = JSON.stringify(baseObj);
  }

  chooseWordEvent(target: EventTarget | null): void {
    if (this === globalVars.currentCard) {
      this.guesCorrectEvent();
    } else if (target !== this.guard) {
      CardItem.guesWrongEvent();
    }
  }

  guesCorrectEvent(): void {
    const baseObj: {
      categories: {
        name: string;
        cards: { word: string; translation: string; click: number; guesses: number; mistakes: number }[];
      }[];
    } = JSON.parse(localStorage.cardBase);
    baseObj.categories.forEach((categ) => {
      if (categ.name === globalVars.currentCategoryObj.name) {
        categ.cards.forEach((card) => {
          if (card.word === globalVars.currentCard.word) {
            card.guesses++;
            globalVars.audioCorrect.play();
          }
        });
      }
    });
    localStorage.cardBase = JSON.stringify(baseObj);

    this.addGuard();
    GameFuncs.nextCard();
    GameFuncs.addStar(true);
  }

  static guesWrongEvent(): void {
    GameFuncs.addStar(false);
    globalVars.counterMistakes++;
    globalVars.audioError.play();

    const baseObj: {
      categories: {
        name: string;
        cards: { word: string; translation: string; click: number; guesses: number; mistakes: number }[];
      }[];
    } = JSON.parse(localStorage.cardBase);
    baseObj.categories.forEach((categ) => {
      if (categ.name === globalVars.currentCategoryObj.name) {
        categ.cards.forEach((card) => {
          if (card.word === globalVars.currentCard.word) {
            card.mistakes++;
          }
        });
      }
    });
    localStorage.cardBase = JSON.stringify(baseObj);
  }

  playSound(): void {
    this.audio.play();
  }

  addActive(): void {
    if (!this.elem.classList.contains('is-active')) {
      this.elem.classList.add('is-active');
    }
  }

  removeActive(): void {
    if (this.elem.classList.contains('is-active')) {
      this.elem.classList.remove('is-active');
    }
  }

  addSwapped(): void {
    if (!this.elem.classList.contains('swapped')) {
      this.elem.classList.add('swapped');
      setTimeout(() => {
        this.text.textContent = this.wordTranlation;
      }, 150);
      this.cardContainer.onmouseleave = () => {
        this.removeSwapped();
      };
      this.swapped = true;
    }
  }

  removeSwapped(): void {
    if (this.elem.classList.contains('swapped')) {
      this.elem.classList.remove('swapped');
      setTimeout(() => {
        this.text.textContent = this.word;
      }, 150);
      this.cardContainer.onmouseleave = () => {};
      this.swapped = false;
    }
  }

  addGuard(): void {
    if (!this.guard.classList.contains('is-active')) {
      this.guard.classList.add('is-active');
    }
  }

  removeGuard(): void {
    if (this.guard.classList.contains('is-active')) {
      this.guard.classList.remove('is-active');
    }
  }
}

import cardsBase from '../../cardsBase/CardsBase';
import { addElem } from '../../commonFuncs/CommonFuncs';
import { GameFuncs } from '../../gameFuncs/GameFuncs';
import { globalVars } from '../../globalVars/globalVars';
import { CardItem } from '../cardItem/CardItem';
import { CategoryItem } from '../categoryItem/CategoryItem';
import { StatisticPage } from '../statisticPage/statisticPage';
import './CardBox.scss';

export class CardBox {
  elem: HTMLElement;

  cards: CardItem[] = [];

  constructor(
    public buttonSwitchMode: HTMLElement,
    public textSwitchMode: HTMLElement,
    public buttonStart: HTMLElement,
  ) {
    this.elem = addElem('div', 'card-box', document.body);

    this.addButtonSwitchAction();

    buttonStart.onclick = () => {
      if (window.location.hash === '' || window.location.hash === '#' || window.location.hash === '#/statistic') {
        return;
      }
      if (globalVars.gameStarted !== true) {
        this.startAction();
      } else {
        globalVars.currentCard.playSound();
      }
    };
  }

  addButtonSwitchAction(): void {
    this.buttonSwitchMode.onclick = () => {
      if (globalVars.activePlayMode) {
        this.buttonSwitchMode.classList.remove('is-active');
        this.textSwitchMode.textContent = 'train';
        this.buttonStart.classList.remove('is-visible');
        this.elem.innerHTML = '';
        globalVars.activePlayMode = false;
        this.fillCards(globalVars.currentCategoryObj.cards);
        this.stopAction();
      } else {
        this.buttonSwitchMode.classList.add('is-active');
        this.textSwitchMode.textContent = 'play';
        this.buttonStart.classList.add('is-visible');
        this.cards.forEach((el) => {
          el.addActive();
        });
        globalVars.activePlayMode = true;
      }
    };
  }

  startAction(): void {
    this.buttonStart.classList.add('is-active');
    globalVars.cardsArray = this.cards.slice().sort(() => Math.random() - 0.5);
    globalVars.gameStarted = true;
    globalVars.counterMistakes = 0;
    GameFuncs.nextCard();
  }

  stopAction(): void {
    this.buttonStart.classList.remove('is-active');
    globalVars.starContainer.innerHTML = '';
    globalVars.gameStarted = false;
    this.changePage();
  }

  fillCards(arrCards: { word: string; translation: string; imageSrc: string; audioSrc: string }[]): void {
    this.cards = [];
    arrCards.forEach((el) => {
      const item = new CardItem(el.word, el.translation, el.imageSrc, el.audioSrc, this.elem);
      this.cards.push(item);
    });
  }

  fillCategories(): void {
    cardsBase.Categories.forEach((el) => {
      const newItem = new CategoryItem(el.name, el.imageSrc, this.elem);
      newItem.addActivity();
    });
  }

  changePage(): void {
    this.elem.innerHTML = '';
    if (window.location.hash === '' || window.location.hash === '#') {
      this.fillCategories();
      globalVars.pageNameElem.textContent = 'Main Page';
    } else if (window.location.hash === '#/statistic') {
      globalVars.pageNameElem.textContent = 'Statistic';
      const table = new StatisticPage(this.elem);
      table.sortedBy = '';
    } else {
      cardsBase.Categories.forEach((elem) => {
        if (`#/categories/${elem.name}` === window.location.hash.replace(/%20/g, ' ')) {
          this.fillCards(elem.cards);
          globalVars.pageNameElem.textContent = elem.name;
          globalVars.currentCategoryObj = elem;
        }
      });
    }
  }
}

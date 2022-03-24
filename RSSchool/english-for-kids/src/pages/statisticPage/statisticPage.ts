import { addElem } from '../../commonFuncs/CommonFuncs';
import { LocalStorageFuncs } from '../../localStorageFuncs/LocalStorageFuncs';
import './statisticPage.scss';

export class StatisticPage {
  elem: HTMLElement;

  table: HTMLElement;

  selectMain: HTMLElement;

  badWordsArray: [] = [];

  // selectExtra: HTMLElement;

  sortedBy = '';

  sortedDir = 1;

  allWordCols: { name: string; elem: HTMLElement }[] = [];

  allCategoriesCols: { name: string; elem: HTMLElement }[] = [];

  allCategories: { name: string; words: number }[] = [];

  baseObj: {
    categories: {
      name: string;
      cards: { word: string; translation: string; click: number; guesses: number; mistakes: number }[];
    }[];
  };

  allCards: {
    word: string;
    translation: string;
    click: number;
    guesses: number;
    mistakes: number;
    percents: number;
  }[] = [];

  constructor(public parent: HTMLElement) {
    this.baseObj = JSON.parse(localStorage.cardBase);

    this.baseObj.categories.forEach((categ) => {
      categ.cards.forEach((card) => {
        this.allCards.push({
          word: card.word,
          translation: card.translation,
          click: card.click,
          guesses: card.guesses,
          mistakes: card.mistakes,
          percents:
            card.guesses === 0 || card.mistakes === 0 ? 0 : Number(((card.mistakes / card.guesses) * 100).toFixed(2)),
        });
      });
    });

    this.baseObj.categories.forEach((el) => {
      this.allCategories.push({ name: el.name, words: el.cards.length });
    });

    this.elem = addElem('div', 'stats', parent);

    this.selectMain = addElem('select', 'select', this.elem);
    StatisticPage.addOption('Categories', this.selectMain);
    StatisticPage.addOption('All Words', this.selectMain);

    this.selectMain.onchange = () => {
      if (this.selectMain instanceof HTMLSelectElement && this.selectMain.value === 'All Words') {
        this.fillTableAllWords();
      }
      if (this.selectMain instanceof HTMLSelectElement && this.selectMain.value === 'Categories') {
        this.fillTableAllCategories();
      }
    };

    const buttonReset = addElem('div', 'button-reset', this.elem, 'Reset');
    buttonReset.onclick = () => {
      LocalStorageFuncs.createDefaultBase();
      this.elem.remove();
      const newElem = new StatisticPage(parent);
      this.elem = newElem.elem;
    };

    // this.selectExtra = addElem('select', 'select', this.elem);
    // this.addOption('All Categories', this.selectExtra);

    this.table = addElem('table', 'table', this.elem);

    this.fillTableAllCategories();
  }

  fillTableAllCategories(): void {
    this.addFirstAllCategories();
    this.allCategories.forEach((categ) => {
      this.addRowAllCategories(categ.name, categ.words);
    });
  }

  addFirstAllCategories(): void {
    this.table.innerHTML = '';
    const row = addElem('tr', 'tr', this.table);

    this.allCategoriesCols = [];
    this.allCategoriesCols.push({ name: 'name', elem: addElem('td', 'td names', row, 'Name') });
    this.allCategoriesCols.push({ name: 'words', elem: addElem('td', 'td names', row, 'Words') });

    this.addSortedMarkCategories();

    this.allCategoriesCols.forEach((col) => {
      this.addSortClickEvent(col);
    });
  }

  addSortClickEvent(col: { name: string; elem: HTMLElement }): void {
    col.elem.onclick = () => {
      if (this.sortedBy === col.name) {
        this.sortedDir *= -1;
      } else {
        this.sortedDir = 1;
      }
      if (col.name === 'name' || col.name === 'words') {
        this.sortAllCategories(col.name);
        this.sortedBy = col.name;
        this.fillTableAllCategories();
      }
    };
  }

  addSortedMarkCategories(): void {
    switch (this.sortedBy) {
      case 'name':
        this.addMarkToColNameCategories(0);
        break;
      case 'words':
        this.addMarkToColNameCategories(1);
        break;

      default:
        break;
    }
  }

  addMarkToColNameCategories(index: number): void {
    if (this.sortedDir > 0) {
      this.allCategoriesCols[index].elem.classList.add('sort-up');
    } else {
      this.allCategoriesCols[index].elem.classList.add('sort-down');
    }
  }

  addRowAllCategories(name: string, words: number): void {
    const row = addElem('tr', 'tr', this.table);
    addElem('td', 'td', row, name);
    addElem('td', 'td', row, `${words}`);
  }

  fillTableAllWords(): void {
    this.addFirstRowAllWords();
    this.allCards.forEach((card) => {
      this.addRowAllWords(card.word, card.translation, card.click, card.mistakes, card.guesses, card.percents);
    });
  }

  addRowAllWords(
    word: string,
    translation: string,
    clicks: number,
    mistakes: number,
    guesses: number,
    percents: number,
  ): void {
    const row = addElem('tr', 'tr', this.table);
    addElem('td', 'td', row, word);
    addElem('td', 'td', row, translation);
    addElem('td', 'td', row, `${clicks}`);
    addElem('td', 'td', row, `${mistakes}`);
    addElem('td', 'td', row, `${guesses}`);
    addElem('td', 'td', row, `${percents}`);
  }

  addFirstRowAllWords(): void {
    this.table.innerHTML = '';
    const row = addElem('tr', 'tr', this.table);

    this.allWordCols = [];
    this.allWordCols.push({ name: 'word', elem: addElem('td', 'td names', row, 'Word') });
    this.allWordCols.push({ name: 'translation', elem: addElem('td', 'td names', row, 'Translation') });
    this.allWordCols.push({ name: 'click', elem: addElem('td', 'td names', row, 'Clicks (train mode)') });
    this.allWordCols.push({ name: 'mistakes', elem: addElem('td', 'td names', row, 'Mistakes') });
    this.allWordCols.push({ name: 'guesses', elem: addElem('td', 'td names', row, 'Guesses') });
    this.allWordCols.push({ name: 'percents', elem: addElem('td', 'td names', row, 'Mistakes(%)') });

    this.addSortedMarkWords();

    this.allWordCols.forEach((col) => {
      col.elem.onclick = () => {
        if (this.sortedBy === col.name) {
          this.sortedDir *= -1;
        } else {
          this.sortedDir = 1;
        }
        if (
          col.name === 'click'
          || col.name === 'translation'
          || col.name === 'word'
          || col.name === 'guesses'
          || col.name === 'mistakes'
          || col.name === 'click'
          || col.name === 'percents'
        ) {
          this.sortAllCards(col.name);
          this.sortedBy = col.name;
          this.fillTableAllWords();
        }
      };
    });
  }

  addSortedMarkWords(): void {
    switch (this.sortedBy) {
      case 'word':
        this.addMarkToColNameWords(0);
        break;
      case 'translation':
        this.addMarkToColNameWords(1);
        break;
      case 'click':
        this.addMarkToColNameWords(2);
        break;
      case 'mistakes':
        this.addMarkToColNameWords(3);
        break;
      case 'guesses':
        this.addMarkToColNameWords(4);
        break;
      case 'percents':
        this.addMarkToColNameWords(5);
        break;

      default:
        break;
    }
  }

  addMarkToColNameWords(index: number): void {
    if (this.sortedDir > 0) {
      this.allWordCols[index].elem.classList.add('sort-up');
    } else {
      this.allWordCols[index].elem.classList.add('sort-down');
    }
  }

  static addOption(value: string, select: HTMLElement): void {
    const el = document.createElement('option');
    el.className = 'option';
    el.value = value;
    el.textContent = value;
    select.appendChild(el);
  }

  sortAllCards(sort: 'click' | 'translation' | 'word' | 'guesses' | 'mistakes' | 'percents'): void {
    function compare(
      a: { word: string; translation: string; click: number; guesses: number; mistakes: number; percents: number },
      b: { word: string; translation: string; click: number; guesses: number; mistakes: number; percents: number },
    ): number {
      if (a[sort] > b[sort]) return 1;
      if (a[sort] === b[sort]) return 0;
      return -1;
    }
    function compareInverse(
      a: { word: string; translation: string; click: number; guesses: number; mistakes: number; percents: number },
      b: { word: string; translation: string; click: number; guesses: number; mistakes: number; percents: number },
    ): number {
      if (a[sort] > b[sort]) return -1;
      if (a[sort] === b[sort]) return 0;
      return 1;
    }

    if (this.sortedDir > 0) {
      this.allCards.sort(compare);
    }
    if (this.sortedDir < 0) {
      this.allCards.sort(compareInverse);
    }
  }

  sortAllCategories(sort: 'name' | 'words'): void {
    function compare(a: { name: string; words: number }, b: { name: string; words: number }): number {
      if (a[sort] > b[sort]) return 1;
      if (a[sort] === b[sort]) return 0;
      return -1;
    }
    function compareInverse(a: { name: string; words: number }, b: { name: string; words: number }): number {
      if (a[sort] > b[sort]) return -1;
      if (a[sort] === b[sort]) return 0;
      return 1;
    }

    if (this.sortedDir > 0) {
      this.allCategories.sort(compare);
    }
    if (this.sortedDir < 0) {
      this.allCategories.sort(compareInverse);
    }
  }
}

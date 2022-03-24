import cardsBase from '../cardsBase/CardsBase';

export class LocalStorageFuncs {
  static createDefaultBase(): void {
    const baseObj: {
      categories: {
        name: string;
        cards: { word: string; translation: string; click: number; guesses: number; mistakes: number }[];
      }[];
    } = { categories: [] };

    cardsBase.Categories.forEach((categ) => {
      const tempCards: { word: string; translation: string; click: number; guesses: number; mistakes: number }[] = [];
      categ.cards.forEach((card) => {
        tempCards.push({
          word: card.word,
          translation: card.translation,
          click: 0,
          guesses: 0,
          mistakes: 0,
        });
      });
      baseObj.categories.push({ name: categ.name, cards: tempCards });
    });

    localStorage.cardBase = JSON.stringify(baseObj);
  }
}

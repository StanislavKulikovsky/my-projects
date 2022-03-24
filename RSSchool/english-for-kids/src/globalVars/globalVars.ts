import { ICardItem } from '../pages/cardItem/ICardItem';

const audioPathDefaultStartPart1 = 'https://github.com/rolling-scopes-school/';
const audioPathDefaultStartPart2 = 'tasks/blob/master/tasks/rslang/english-for.kids.data/';
const audioPathDefaultStart = audioPathDefaultStartPart1 + audioPathDefaultStartPart2;
const audioPathDefaultEnd = '?raw=true';

export const globalVars: {
  wrongHash: boolean;
  pageNameElem: HTMLElement;
  starContainer: HTMLElement;
  bannerElem: HTMLElement;

  counterMistakes: number;
  gameStarted: boolean;
  activePlayMode: boolean;
  cardsArray: ICardItem[];
  currentCard: ICardItem;
  currentCategoryObj: {
    name: string;
    imageSrc: string;
    cards: { word: string; translation: string; imageSrc: string; audioSrc: string }[];
  };
  audioError: HTMLAudioElement;
  audioCorrect: HTMLAudioElement;
  audioFailure: HTMLAudioElement;
  audioSucces: HTMLAudioElement;
} = {
  wrongHash: false,
  pageNameElem: HTMLElement.prototype,
  starContainer: HTMLElement.prototype,
  bannerElem: HTMLElement.prototype,

  counterMistakes: 0,
  gameStarted: false,
  activePlayMode: false,
  cardsArray: [],
  currentCard: {
    elem: HTMLElement.prototype,
    wordTranlation: '',
    text: HTMLElement.prototype,
    swapped: false,
    swapper: HTMLElement.prototype,
    cardContainer: HTMLElement.prototype,
    guard: HTMLElement.prototype,
    audio: HTMLAudioElement.prototype,
    word: '',

    playSound: () => {},
  },
  currentCategoryObj: { name: '', imageSrc: '', cards: [] },
  audioError: new Audio(`${audioPathDefaultStart}audio/error.mp3${audioPathDefaultEnd}`),
  audioCorrect: new Audio(`${audioPathDefaultStart}audio/correct.mp3${audioPathDefaultEnd}`),
  audioFailure: new Audio(`${audioPathDefaultStart}audio/failure.mp3${audioPathDefaultEnd}`),
  audioSucces: new Audio(`${audioPathDefaultStart}audio/success.mp3${audioPathDefaultEnd}`),
};

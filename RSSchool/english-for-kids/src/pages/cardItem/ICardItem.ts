export interface ICardItem {
  elem: HTMLElement;
  wordTranlation: string;
  text: HTMLElement;
  swapped: boolean;
  swapper: HTMLElement;
  cardContainer: HTMLElement;
  guard: HTMLElement;
  audio: HTMLAudioElement;
  word: string;

  playSound(): void;
}

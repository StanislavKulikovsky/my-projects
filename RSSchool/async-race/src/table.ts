import { addElem, createCarSvg } from './baseFuctions';

export class Table {
  table: HTMLElement;

  rows: HTMLElement[];

  sorterWins: HTMLElement;

  sorterTimes: HTMLElement;

  constructor(table: HTMLElement) {
    this.table = table;
    this.rows = [];
    this.sorterWins = addElem('td', 'wins-active', document.body);
    this.sorterTimes = addElem('td', 'best-time-active', document.body);
  }

  createInner(): void {
    const tr0 = addElem('tr', '', this.table);
    tr0.id = 'n0';
    this.createRow(tr0, true);
    for (let i = 1; i < 11; i++) {
      const tr = addElem('tr', '', this.table);
      tr.id = `n${i}`;
      this.createRow(tr, false);
      this.rows.push(tr);
    }
  }

  static fillRow(tr: HTMLElement, number: number, color: string, name: string, wins: number, time: number): void {
    tr.querySelectorAll('td').forEach((elem) => {
      switch (elem.className) {
        case 'number':
          elem.textContent = `${number}`;
          break;
        case 'car':
          elem.innerHTML = '';
          createCarSvg(color, elem);
          break;
        case 'name':
          elem.textContent = name;
          break;
        case 'wins':
          elem.textContent = `${wins}`;
          break;
        case 'best-time':
          elem.textContent = `${time}`;
          break;
        default:
          break;
      }
    });
  }

  createRow(tr: HTMLElement, first: boolean): void {
    const td1 = addElem('td', 'number', tr);
    const td2 = addElem('td', 'car', tr);
    const td3 = addElem('td', 'name', tr);
    const td4 = addElem('td', 'wins', tr);
    const td5 = addElem('td', 'best-time', tr);
    if (first) {
      td1.textContent = 'Number';
      td2.textContent = 'Car';
      td3.textContent = 'Name';
      td4.remove();
      td5.remove();
      const td6 = this.sorterWins;
      tr.appendChild(td6);
      const td7 = this.sorterTimes;
      tr.appendChild(td7);
      td6.textContent = 'Wins';
      td7.textContent = 'Best time';
    }
  }
}

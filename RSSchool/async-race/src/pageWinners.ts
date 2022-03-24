import { addElem, info } from './baseFuctions';
import { ServerFunc } from './serverFuncs';
import { Table } from './table';

export class PageWinners {
  page: HTMLElement;

  table: Table;

  selector: HTMLElement;

  counter: HTMLElement;

  pageNumber: HTMLElement;

  selectorButtons: HTMLElement[] = [];

  constructor() {
    this.page = addElem('div', 'winners-div', document.body);
    this.page.remove();
    const heading = addElem('h2', '', this.page);
    heading.innerHTML = 'Winners (';
    this.counter = addElem('span', 'winners-number', heading, '0');
    heading.append(')');
    this.pageNumber = addElem('label', 'label', this.page, 'Page #1');
    const table = addElem('table', 'table', this.page);
    this.table = new Table(table);
    this.table.createInner();
    this.selector = addElem('div', 'winners-page-selector', this.page);
    this.createWinnersPageSelector();
    this.fillTable(1, info.sort, info.order);
    this.addSorterListeners();
    addElem('div', 'button _button-gray', this.page, 'refresh').onclick = () => {
      this.fillTable(info.pageNumberWinners, info.sort, info.order);
    };
  }

  createWinnersPageSelector(): void {
    this.selectorButtons[0] = addElem('div', 'button _button-green _disable', this.selector, 'prev');
    this.selectorButtons[1] = addElem('div', 'button _button-green _disable', this.selector, 'next');
    this.selector.addEventListener('click', (event: MouseEvent) => {
      if (event.target instanceof Element) {
        if (event.target.className === 'button _button-green') {
          if (event.target.textContent === 'prev') {
            this.changeToPrev();
          } else {
            this.changeToNext();
          }
        }
      }
    });
  }

  fillTable(page: number, sort: string, order: string): void {
    this.table.rows.forEach((elem) => {
      elem.querySelectorAll('td').forEach((el) => {
        el.textContent = '';
      });
    });
    ServerFunc.getWinners(page, sort, order)
      .then((response) => {
        info.winners = Number(response.count);
        response.winnersArray.forEach((elem, index) => {
          ServerFunc.getCar(elem.id).then((resp) => {
            Table.fillRow(this.table.rows[index], index + 1, resp.color, resp.name, elem.wins, elem.time);
          });
        });
      })
      .then(() => {
        this.counter.textContent = String(info.winners);

        this.selectorButtons.forEach((elem) => {
          elem.className = 'button _button-green';
        });
        if (info.pageNumberWinners < 2) {
          this.selectorButtons[0].classList.add('_disable');
        }
        if (info.pageNumberWinners >= info.winners / 10) {
          this.selectorButtons[1].classList.add('_disable');
        }
        this.pageNumber.textContent = `Page #${info.pageNumberWinners}`;
      });
  }

  changeToPrev(): void {
    this.fillTable(--info.pageNumberWinners, info.sort, info.order);
  }

  changeToNext(): void {
    this.fillTable(++info.pageNumberWinners, info.sort, info.order);
  }

  addSorterListeners(): void {
    this.table.sorterWins.onclick = (event) => {
      if (event.target instanceof HTMLElement) {
        if (event.target.classList.contains('_down')) {
          event.target.classList.remove('_down');
          event.target.classList.add('_up');
          info.order = 'DESC';
        } else {
          if (event.target.classList.contains('_up')) {
            event.target.classList.remove('_up');
          }
          event.target.classList.add('_down');
          info.order = 'ASC';
          if (this.table.sorterTimes.classList.contains('_up')) {
            this.table.sorterTimes.classList.remove('_up');
          }
          if (this.table.sorterTimes.classList.contains('_down')) {
            this.table.sorterTimes.classList.remove('_down');
          }
        }
        info.sort = 'wins';
        this.fillTable(info.pageNumberWinners, info.sort, info.order);
      }
    };
    this.table.sorterTimes.onclick = (event) => {
      if (event.target instanceof HTMLElement) {
        if (event.target.classList.contains('_down')) {
          event.target.classList.remove('_down');
          event.target.classList.add('_up');
          info.order = 'DESC';
        } else {
          if (event.target.classList.contains('_up')) {
            event.target.classList.remove('_up');
          }
          event.target.classList.add('_down');
          info.order = 'ASC';
          if (this.table.sorterWins.classList.contains('_up')) {
            this.table.sorterWins.classList.remove('_up');
          }
          if (this.table.sorterWins.classList.contains('_down')) {
            this.table.sorterWins.classList.remove('_down');
          }
        }
        info.sort = 'time';
        this.fillTable(info.pageNumberWinners, info.sort, info.order);
      }
    };
  }
}

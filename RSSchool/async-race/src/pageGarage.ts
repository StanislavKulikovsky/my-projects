import { addElem, info } from './baseFuctions';
import { CarsItem } from './carsItem';
import { Tools } from './garageTools';
import { ServerFunc } from './serverFuncs';

export class PageGarage {
  page: HTMLElement;

  tools: Tools;

  list: HTMLElement;

  selector: HTMLElement;

  selectorButtons: HTMLElement[] = [];

  items: CarsItem[] = [];

  counter: HTMLElement;

  pageNumber: HTMLElement;

  arrGenerator = [
    ['Renault', 'BMW', 'Audi', 'Tesla', 'Honda', 'Lada', 'Mercedes', 'Ferrari', 'Ford', 'Lexus'],
    ['Laguna', 'Mustang', 'FF', 'GLE', 'Spider', 'RX', 'Focus', 'Raptor', 'Fiesta', 'Megane'],
    ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  ];

  constructor() {
    this.page = addElem('div', 'garage-div', document.body);
    this.tools = new Tools(addElem('div', 'tools', this.page));
    this.addToolsListeners();

    const heading = addElem('h2', '', this.page);
    heading.innerHTML = 'Garage (';
    this.counter = addElem('span', 'cars-number', heading);
    this.counter.textContent = '0';
    heading.append(')');

    this.pageNumber = addElem('label', 'label', this.page, 'Page #1');
    this.list = addElem('div', 'cars-list', this.page);
    this.fillList(1);

    this.selector = addElem('div', 'cars-page-selector', this.page);
    this.createCarsPageSelector();
  }

  createCarsPageSelector(): void {
    this.selectorButtons[0] = addElem('div', 'button _button-green _disable', this.selector, 'prev');
    this.selectorButtons[1] = addElem('div', 'button _button-green', this.selector, 'next');
    this.selector.addEventListener('click', (event: MouseEvent) => {
      if (event.target instanceof Element) {
        if (event.target.className === 'button _button-green') {
          if (event.target.textContent === 'prev') {
            this.changePageToPrev();
          } else {
            this.changePageToNext();
          }
        }
      }
    });
  }

  addToolsListeners(): void {
    this.tools.elem.addEventListener('click', (event) => {
      if (event.target instanceof Element) {
        switch (event.target.textContent) {
          case 'create':
            this.createCar();
            break;
          case 'race':
            this.startRace();
            break;
          case 'reset':
            this.reset();
            break;
          case 'generate cars':
            this.generateCars();
            break;

          default:
            break;
        }
      }
    });
  }

  addItemToolsListeners(
    tools: HTMLElement,
    id: number,
    name: string,
    color: string,
    svg: SVGElement,
    buttonStart: HTMLElement,
    buttonStop: HTMLElement,
  ): void {
    tools.onclick = (event) => {
      if (event.target instanceof Element) {
        switch (event.target.textContent) {
          case 'select':
            this.updateCar(id, name, color);
            break;
          case 'remove':
            this.removeCar(id);
            break;
          case 'start':
            this.driveCar(id, svg, buttonStart, buttonStop);
            break;

          default:
            break;
        }
      }
    };
  }

  createCar(): void {
    ServerFunc.createCar(this.tools.inputCreateText.value, this.tools.inputCreateColor.value).then(() => {
      this.tools.inputCreateText.value = '';
      this.tools.inputCreateColor.value = '#000000';
      this.fillList(info.pageNumberGarage);
    });
  }

  updateCar(id: number, name: string, color: string): void {
    if (!this.tools.inputUpdateText.classList.contains('_disable')) {
      return;
    }
    this.tools.inputUpdateText.classList.remove('_disable');
    this.tools.inputUpdateColor.classList.remove('_disable');
    this.tools.buttonUpdate.classList.remove('_disable');
    this.tools.inputUpdateText.value = name;
    this.tools.inputUpdateColor.value = color;
    this.tools.buttonUpdate.onclick = () => {
      if (!this.tools.buttonUpdate.classList.contains('_disable')) {
        ServerFunc.updateCar(id, this.tools.inputUpdateText.value, this.tools.inputUpdateColor.value).then(() => {
          this.tools.disableUpdateTool();
        });
      }
    };
  }

  removeCar(id: number): void {
    ServerFunc.deleteCar(id).then(() => {
      this.fillList(info.pageNumberGarage);
      this.tools.disableUpdateTool();
      ServerFunc.deleteWinner(id);
    });
  }

  async driveCar(
    id: number,
    svg: SVGElement,
    buttonStart: HTMLElement,
    buttonStop: HTMLElement,
  ): Promise<{ res: boolean; time: number }> {
    buttonStart.classList.add('_disable');
    info.carsNotReady++;
    if (!this.tools.buttonRace.classList.contains('_disable')) {
      this.tools.buttonRace.classList.add('_disable');
    }
    return ServerFunc.startEngine(id).then(async (response) => {
      const tickNeeded = Math.round((response.distance / response.velocity) * 100);
      const speed = (100 * 1000) / tickNeeded;
      const time = Number((tickNeeded / 100000).toFixed(2));
      let coordinate = 0;
      const interval = setInterval(() => {
        svg.style.left = `${(coordinate += speed)}%`;
        if (coordinate > 100) svg.style.left = '100%';
      }, 10);
      buttonStop.classList.remove('_disable');
      buttonStop.onclick = () => {
        this.stopCar(id, svg, buttonStart, buttonStop, interval);
      };

      return await ServerFunc.driveEngine(id)
        .then(() => {
          clearInterval(interval);
          if (++info.carsFin >= this.items.length && this.tools.buttonReset.classList.contains('_disable')) {
            this.tools.buttonReset.classList.remove('_disable');
          }
          return { res: true, time };
        })
        .catch((err) => {
          clearInterval(interval);
          if (++info.carsFin >= this.items.length && this.tools.buttonReset.classList.contains('_disable')) {
            this.tools.buttonReset.classList.remove('_disable');
            info.carsFin = -1000;
          }
          if (err.message === '404') {
            svg.style.left = '0%';
            buttonStop.classList.add('_disable');
            buttonStart.classList.remove('_disable');
            if (++info.carsFin >= this.items.length && this.tools.buttonReset.classList.contains('_disable')) {
              this.tools.buttonRace.classList.remove('_disable');
              info.carsFin = -1000;
            }
          }
          return { res: false, time };
        });
    });
  }

  stopCar(
    id: number,
    svg: SVGElement,
    buttonStart: HTMLElement,
    buttonStop: HTMLElement,
    interval: NodeJS.Timeout,
  ): void {
    buttonStop.classList.add('_disable');
    ServerFunc.stopEngine(id).then(() => {
      clearInterval(interval);
      svg.style.left = '0%';
      buttonStart.classList.remove('_disable');
      info.carsNotReady--;
      if (this.tools.buttonRace.classList.contains('_disable') && info.carsNotReady < 1) {
        this.tools.buttonRace.classList.remove('_disable');
      }
    });
  }

  startRace(): void {
    info.carsFin = 0;
    if (!this.tools.buttonReset.classList.contains('_disable')) {
      this.tools.buttonReset.classList.add('_disable');
    }
    const arrPromise: Promise<{ id: number; time: number; name: string }>[] = [];
    this.items.forEach((elem) => {
      arrPromise.push(
        new Promise((resolve) => {
          this.driveCar(elem.id, elem.svg, elem.buttonStart, elem.buttonStop).then((res) => {
            if (res.res) resolve({ id: elem.id, time: res.time, name: elem.name });
          });
        }),
      );
    });

    Promise.race(arrPromise).then((resolve) => {
      PageGarage.winRace(resolve.id, resolve.time, resolve.name);
    });
  }

  reset(): void {
    this.items.forEach((elem) => {
      elem.svg.style.left = '0%';
      elem.buttonStart.classList.remove('_disable');
      info.carsNotReady = 0;
      this.tools.buttonRace.classList.remove('_disable');
      this.tools.buttonReset.classList.add('_disable');
    });
  }

  static winRace(id: number, time: number, name: string): void {
    const div = addElem('div', 'win-message', document.body, `Winner: ${name}; Time: ${time}`);
    setTimeout(() => {
      div.remove();
    }, 3000);
    ServerFunc.getWinner(id)
      .then((response) => {
        ServerFunc.updateWinner(id, response.wins + 1, response.time < time ? response.time : time);
      })
      .catch(() => {
        ServerFunc.createWinner(id, 1, time);
      });
  }

  generateCars(): void {
    for (let i = 0; i < 100; i++) {
      const name = `${this.arrGenerator[0][Math.floor(Math.random() * 10)]} ${
        this.arrGenerator[1][Math.floor(Math.random() * 10)]
      }`;
      let color = '#';
      for (let j = 0; j < 6; j++) {
        color += this.arrGenerator[2][Math.floor(Math.random() * 16)];
      }
      ServerFunc.createCar(name, color);
    }
    this.fillList(info.pageNumberGarage);
  }

  fillList(page: number): void {
    let carsArray: [{ name: string; color: string; id: number }];

    ServerFunc.getCars(page)
      .then((response) => {
        info.cars = Number(response.count);
        info.pageNumberGarage = page;
        carsArray = response.carsArray;
      })
      .then(() => {
        this.items = [];
        this.list.innerHTML = '';
        for (let i = 0; i < carsArray.length; i++) {
          const newCarItem = new CarsItem(this.list, carsArray[i].name, carsArray[i].color, carsArray[i].id);
          this.items.push(newCarItem);
          this.addItemToolsListeners(
            newCarItem.tools,
            newCarItem.id,
            newCarItem.name,
            newCarItem.color,
            newCarItem.svg,
            newCarItem.buttonStart,
            newCarItem.buttonStop,
          );
        }
        this.counter.textContent = String(info.cars);
        this.selectorButtons.forEach((elem) => {
          elem.className = 'button _button-green';
        });
        if (info.pageNumberGarage < 2) {
          this.selectorButtons[0].classList.add('_disable');
        }
        if (info.pageNumberGarage >= info.cars / 7) {
          this.selectorButtons[1].classList.add('_disable');
        }
        this.pageNumber.textContent = `Page #${info.pageNumberGarage}`;
      });
  }

  changePageToPrev(): void {
    this.fillList(--info.pageNumberGarage);
    info.carsFin = -1000;
    info.carsNotReady = 0;
    this.tools.buttonReset.className = 'button _button-green _disable';
    this.tools.buttonRace.className = 'button _button-green';
  }

  changePageToNext(): void {
    this.fillList(++info.pageNumberGarage);
    info.carsFin = -1000;
    info.carsNotReady = 0;
    this.tools.buttonReset.className = 'button _button-green _disable';
    this.tools.buttonRace.className = 'button _button-green';
  }
}

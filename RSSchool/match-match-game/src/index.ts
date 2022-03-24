import { createAboutPage } from './aboutPage';
import { Button } from './button';
import { CommonWebElement } from './common';
import { updateStartButton } from './images/startButton';
import { Logo } from './logo';
import { createModal } from './modal';
import { createBest } from './pageBest';
import { changePage, PageSelector } from './pageSelector';
import { createSittingsPage } from './sittingsPage';
import './styles.scss';

const currentSittings = {
  difficulty: 'low (4x4)',
  collection: 'animals',
};
const gameInfo = {
  id: '',
  currentCard: document.createElement('div'),
  pairs: 0,
  count: 0,
  disabled: false,
  time: 0,
  deleted: true,
  bads: 0,
};
const player = {
  firstName: '',
  lastName: '',
  email: '',
  img64: '',
  result: 0,
};
const header: CommonWebElement = new CommonWebElement('div', 'header');
header.addElement();

const logoHeader: Logo = new Logo(header);
logoHeader.addElement();
const btnAbout: Button = new Button('About Game', 'button-page-selector');
const btnBest: Button = new Button('Best Score', 'button-page-selector');
const btnSittings: Button = new Button('Game Sittings', 'button-page-selector');

const pageSelector: PageSelector = new PageSelector(header, btnAbout, btnBest, btnSittings);
pageSelector.addElement();

const root = { pageMain: createAboutPage() };
const buttonRegister: Button = new Button('register new player', 'button-register', header.element);
buttonRegister.addElement();
buttonRegister.element.onclick = () => {
  if (!gameInfo.deleted) {
    gameInfo.deleted = true;
    root.pageMain.element.remove();
    pageSelector.updateActivePageButton('');
  }
  createModal(player, buttonRegister, header, gameInfo, root, currentSittings, pageSelector, btnBest);
};
pageSelector.updateActivePageButton(btnAbout.content);

btnAbout.element.onclick = () => {
  if (!btnAbout.element.classList.contains('active')) {
    changePage(btnAbout, gameInfo, root, pageSelector, true);
    root.pageMain = createAboutPage();
    updateStartButton(gameInfo);
  }
};

btnSittings.element.onclick = () => {
  if (!btnSittings.element.classList.contains('active')) {
    changePage(btnSittings, gameInfo, root, pageSelector, true);
    root.pageMain = createSittingsPage(currentSittings);
    updateStartButton(gameInfo);
  }
};

btnBest.element.onclick = () => {
  if (!btnBest.element.classList.contains('active')) {
    changePage(btnBest, gameInfo, root, pageSelector, true);
    createBest(root);
    updateStartButton(gameInfo);
  }
};

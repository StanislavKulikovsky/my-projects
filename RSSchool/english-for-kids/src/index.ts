import { GameFuncs } from './gameFuncs/GameFuncs';
import { LocalStorageFuncs } from './localStorageFuncs/LocalStorageFuncs';
import { CardBox } from './pages/cardBox/CardBox';
import { Footer } from './pages/footer/Footer';
import { Header } from './pages/header/Header';
import { Menu } from './pages/menu/Menu';
import './styles.scss';

const header = new Header();
const menu = new Menu(header.buttonHamburger, header.elem);
const cardBox = new CardBox(header.buttonSwitchMode, header.textSwitchMode, header.buttonStart);
const footer = new Footer();
footer.add();

menu.changeMenuItem();
cardBox.changePage();

window.onhashchange = () => {
  menu.changeMenuItem();
  GameFuncs.resetGame();
  cardBox.stopAction();
};

if (!localStorage.cardBase) {
  LocalStorageFuncs.createDefaultBase();
}

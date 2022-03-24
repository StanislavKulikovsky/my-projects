import './styles.scss';

import { PageSelector } from './pageSelector';
import { PageGarage } from './pageGarage';
import { PageWinners } from './pageWinners';

const garagePage = new PageGarage();

const winnersPage = new PageWinners();

const pageSelector = new PageSelector(garagePage.page, winnersPage.page);
pageSelector.createInner();

garagePage.fillList(1);

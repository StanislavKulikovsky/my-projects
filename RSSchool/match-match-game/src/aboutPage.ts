import { CommonWebElement } from './common';

import image1 from './images/image1.png';
import image2 from './images/image2.png';
import image3 from './images/image3.png';

export function createAboutPage(): CommonWebElement {
  const main: CommonWebElement = new CommonWebElement('div', 'main');

  main.addElement();

  const heading2 = document.createElement('h2');
  heading2.className = 'h2';
  heading2.textContent = 'How to play?';
  main.element.appendChild(heading2);

  const highContainer = document.createElement('div');
  highContainer.className = 'about-page__high-container';
  main.element.appendChild(highContainer);

  const lowContainer1 = document.createElement('div');
  lowContainer1.className = 'about-page__low-container';
  highContainer.appendChild(lowContainer1);
  const item11 = document.createElement('div');
  item11.className = 'about-page__item-1-1';
  lowContainer1.appendChild(item11);
  const icon11 = document.createElement('div');
  icon11.className = 'number-icon';
  icon11.textContent = '1';
  item11.appendChild(icon11);
  const text11 = document.createElement('p');
  text11.className = 'about-page__item-text';
  text11.textContent = 'Register new player in game';
  item11.appendChild(text11);
  const item12 = document.createElement('img');
  item12.className = 'about-page__item-1-2';
  item12.src = image1;
  lowContainer1.appendChild(item12);

  const lowContainer2 = document.createElement('div');
  lowContainer2.className = 'about-page__low-container';
  highContainer.appendChild(lowContainer2);
  const item21 = document.createElement('div');
  item21.className = 'about-page__item-2-1';
  lowContainer2.appendChild(item21);
  const icon21 = document.createElement('div');
  icon21.className = 'number-icon';
  icon21.textContent = '2';
  item21.appendChild(icon21);
  const text21 = document.createElement('p');
  text21.className = 'about-page__item-text';
  text21.textContent = 'Configure your game settings';
  item21.appendChild(text21);
  const item22 = document.createElement('img');
  item22.className = 'about-page__item-2-2';
  item22.src = image2;
  lowContainer2.appendChild(item22);

  const lowContainer3 = document.createElement('div');
  lowContainer3.className = 'about-page__low-container';
  highContainer.appendChild(lowContainer3);
  const item31 = document.createElement('div');
  item31.className = 'about-page__item-3-1';
  lowContainer3.appendChild(item31);
  const icon31 = document.createElement('div');
  icon31.className = 'number-icon';
  icon31.textContent = '3';
  item31.appendChild(icon31);
  const text31 = document.createElement('p');
  text31.className = 'about-page__item-text';
  text31.textContent = 'Start you new game! Remember card positions and match it before times up.';
  item31.appendChild(text31);
  const item32 = document.createElement('img');
  item32.className = 'about-page__item-3-2';
  item32.src = image3;
  lowContainer3.appendChild(item32);

  return main;
}

import { Button } from './button';
import { addClass, removeClass } from './classInserter';

import { CommonWebElement, createElem, createInput } from './common';
import { createAvatar } from './createAvatar';
import { createPlayer } from './createPlayer';

import { PageSelector } from './pageSelector';

function createCheckMark(parent: HTMLElement, index: string): HTMLElement {
  const circle = createElem('div', `mark-circle${index}`, parent);
  const square = createElem('div', 'mark-square', circle);
  square.textContent = '✔';
  return square;
}

function checkValidName(value: string, errorDiv: HTMLElement, mark: HTMLElement, elem: HTMLInputElement): void {
  if (!/[^\s]/.test(value)) {
    removeClass(mark, 'mark-square-active');
    errorDiv.textContent = 'field is empty!';
    elem.style.backgroundColor = '#ff000040';
  } else {
    const invalid = value.match(/[^\p{Alpha}\p{M}\p{Join_C}\s]/iu);
    if (invalid) {
      removeClass(mark, 'mark-square-active');
      errorDiv.textContent = `symbol "${invalid}" is not allowed`;
      elem.style.backgroundColor = '#ff000040';
    } else {
      addClass(mark, 'mark-square-active');
      errorDiv.textContent = '';
      elem.style.backgroundColor = '#21212114';
    }
  }
}

function checkValidEmail(value: string, errorDiv: HTMLElement, mark: HTMLElement, elem: HTMLInputElement): void {
  if (!/[^\s]/.test(value)) {
    removeClass(mark, 'mark-square-active');
    errorDiv.textContent = 'field is empty!';
    elem.style.backgroundColor = '#ff000040';
    // return;
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
    removeClass(mark, 'mark-square-active');
    errorDiv.textContent = 'invalid email!';
    elem.style.backgroundColor = '#ff000040';
  } else {
    addClass(mark, 'mark-square-active');
    errorDiv.textContent = '';
    elem.style.backgroundColor = '#21212114';
  }
}

function checkAllValid(err1: HTMLElement, err2: HTMLElement, err3: HTMLElement, button: HTMLElement): void {
  if (err1.textContent === '' && err2.textContent === '' && err3.textContent === '') {
    removeClass(button, 'modal-confirm-non-active');
  } else {
    addClass(button, 'modal-confirm-non-active');
  }
}

export function createModal(
  player: {
    firstName: string;
    lastName: string;
    email: string;
    img64: string;
    result: number;
  },
  buttonRegister: Button,
  header: CommonWebElement,
  gameInfo: {
    id: string;
    currentCard: HTMLElement;
    pairs: number;
    count: number;
    disabled: boolean;
    time: number;
    deleted: boolean;
    bads: number;
  },
  root: { pageMain: CommonWebElement },
  currentSittings: { difficulty: string; collection: string },
  pageSelector: PageSelector,
  btnBest: Button,
): HTMLElement {
  const bg = createElem('div', 'modal-bg', document.body);
  bg.addEventListener('click', (elem) => {
    if (elem.target === bg) {
      bg.remove();
    }
  });
  const modalMain = createElem('div', 'modal-main', bg);
  const heading = createElem('h2', 'h2 modal-heading', modalMain);
  heading.textContent = 'Register new Player';
  const form = createElem('form', 'modal-form', modalMain);
  const label1 = createElem('label', 'modal-label1', form);

  label1.textContent = 'First Name';
  const inputFirstName = createInput(form, 'text', 'modal-input', '', 30);
  const errorFirst = createElem('div', 'error-message', form);
  errorFirst.textContent = 'error';

  const label2 = createElem('label', 'modal-label2', form);
  label2.textContent = 'Last Name';
  const inputLastName = createInput(form, 'text', 'modal-input', '', 30);
  const errorLast = createElem('div', 'error-message', form);
  errorLast.textContent = 'error';

  const label3 = createElem('label', 'modal-label3', form);
  label3.textContent = 'E-mail';
  const inputEmail = createInput(form, 'email', 'modal-input', '', 30);
  const errorEmail = createElem('div', 'error-message', form);
  errorEmail.textContent = 'error';

  const mark1 = createCheckMark(form, '1');
  const mark2 = createCheckMark(form, '2');
  const mark3 = createCheckMark(form, '3');

  createAvatar(modalMain, player);

  const confirmButton = createElem('div', 'modal-confirm modal-confirm-non-active', modalMain);
  confirmButton.textContent = 'add user';
  confirmButton.onclick = () => {
    if (!confirmButton.classList.contains('modal-confirm-non-active')) {
      createPlayer(
        player,
        bg,
        inputFirstName.value,
        inputLastName.value,
        inputEmail.value,
        buttonRegister,
        header,
        gameInfo,
        root,
        currentSittings,
        pageSelector,
        btnBest,
      );
    }
  };
  const cancelButton = createElem('div', 'modal-cancel', modalMain);
  cancelButton.textContent = 'cancel';
  cancelButton.onclick = () => {
    bg.remove();
  };

  inputFirstName.oninput = () => {
    checkValidName(inputFirstName.value, errorFirst, mark1, inputFirstName);
    checkAllValid(errorFirst, errorLast, errorEmail, confirmButton);
  };
  checkValidName(inputFirstName.value, errorFirst, mark1, inputFirstName);
  inputLastName.oninput = () => {
    checkValidName(inputLastName.value, errorLast, mark2, inputLastName);
    checkAllValid(errorFirst, errorLast, errorEmail, confirmButton);
  };
  checkValidName(inputLastName.value, errorLast, mark2, inputLastName);
  inputEmail.oninput = () => {
    checkValidEmail(inputEmail.value, errorEmail, mark3, inputEmail);
    checkAllValid(errorFirst, errorLast, errorEmail, confirmButton);
  };
  checkValidEmail(inputEmail.value, errorEmail, mark3, inputEmail);

  return bg;
}

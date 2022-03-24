const buttonLeftArrowPets = document.querySelector(
  ".pets-in-zoo-block__button-left-arrow"
);
const buttonRightArrowPets = document.querySelector(
  ".pets-in-zoo-block__button-right-arrow"
);
const cardBox = document.querySelector(".pets-in-zoo-block__cards-box");
const cardBlock = document.querySelector(".pets-in-zoo-block");
let readyPets = true;

let testimonialsItems = document.querySelectorAll(".testimonials-block__item");
let testimonialsInterval = setInterval(testimonialsNext, 10000);
let x = 10;
const testimonialsBlock = document.querySelector(".testimonials-block");

addTestimonialsPause();

function testimonialsNext() {
  let newItems = [4];
  testimonialsItems = document.querySelectorAll(".testimonials-block__item");
  const oldBox = document.querySelector(".testimonials-block__item-box");
  const newBox = oldBox.cloneNode(false);
  testimonialsItems.forEach((elem, index) => {
    newItems[index === 0 ? 2 : index - 1] = elem.cloneNode(true);
  });
  newItems.forEach((elem) => {
    newBox.appendChild(elem);
  });
  oldBox.style.position = "absolute";
  testimonialsBlock.style.overflow = "hidden";
  oldBox.after(newBox);
  newBox.style.transform = `translate(${newBox.offsetWidth + 20}px, 0px)`;
  setTimeout(() => {
    newBox.style.transition = "0.4s linear";
    newBox.style.transform = `translate(0px, 0px)`;
  }, 20);
  setTimeout(() => {
    newBox.style.transition = "0s";
  }, 420);
  setTimeout(() => {
    oldBox.style.transition = "0.4s linear";
    oldBox.style.transform = `translate(-${oldBox.offsetWidth + 20}px, 0px)`;
  }, 20);
  setTimeout(() => {
    oldBox.remove();
    testimonialsBlock.style.overflow = "visible";
    addTestimonialsPause();
  }, 420);
}

function addTestimonialsPause() {
  testimonialsItems = document.querySelectorAll(".testimonials-block__item");
  testimonialsItems.forEach((elem) => {
    elem.onclick = () => {
      clearInterval(testimonialsInterval);
      setTimeout(() => {
        testimonialsInterval = setInterval(testimonialsNext, 10000);
      }, 20000);
    };
  });
}

buttonRightArrowPets.onclick = () => {
  if (!readyPets) {
    return;
  }
  readyPets = false;
  if (window.innerWidth < 1920) {
    cardBlock.style.overflow = "hidden";
  }
  const avalibleCards = document.querySelectorAll(
    ".pets-in-zoo-block__card-link"
  );
  const newCards = [6];
  avalibleCards.forEach((elem) => {
    switch (elem.getAttribute("number")) {
      case "0":
        newCards[4] = elem.cloneNode(true);
        newCards[4].setAttribute("number", "1");
        break;
      case "1":
        newCards[3] = elem.cloneNode(true);
        newCards[3].classList.add("pets-in-zoo-block-card_last-320");
        newCards[3].setAttribute("number", "2");
        break;
      case "2":
        newCards[2] = elem.cloneNode(true);
        newCards[2].setAttribute("number", "3");
        break;
      case "3":
        newCards[1] = elem.cloneNode(true);
        newCards[1].classList.remove("pets-in-zoo-block-card_last-320");
        newCards[1].classList.add("pets-in-zoo-block-card_last");
        newCards[1].setAttribute("number", "4");
        break;
      case "4":
        newCards[0] = elem.cloneNode(true);
        newCards[0].setAttribute("number", "5");
        break;
      case "5":
        newCards[5] = elem.cloneNode(true);
        newCards[5].classList.remove("pets-in-zoo-block-card_last");
        newCards[5].setAttribute("number", "0");
        break;
    }
  });
  avalibleCards.forEach((elem) => {
    elem.style.transform = `translate(0px,-${cardBox.offsetHeight}px`;
    elem.style.pointerEvents = "none";
    setTimeout(() => {
      elem.style.transition = "0.4s linear";
      elem.style.transform = `translate(400%, -${cardBox.offsetHeight}px`;
    }, 10);
    setTimeout(() => {
      elem.style.transition = "0s linear";
      elem.remove();
    }, 410);
  });
  newCards.forEach((elem) => {
    buttonLeftArrowPets.after(elem);
    elem.style.transform = `translate(-400%,0px`;
    setTimeout(() => {
      elem.style.transition = "0.4s linear";
      elem.style.transform = `translate(0px,0px`;
    }, 10);
    setTimeout(() => {
      elem.style.transition = "0s linear";
      readyPets = true;
      cardBlock.style.overflow = "visible";
    }, 410);
  });
};
buttonLeftArrowPets.onclick = () => {
  if (!readyPets) {
    return;
  }
  readyPets = false;
  if (window.innerWidth < 1920) {
    cardBlock.style.overflow = "hidden";
  }
  const avalibleCards = document.querySelectorAll(
    ".pets-in-zoo-block__card-link"
  );
  const newCards = [6];
  avalibleCards.forEach((elem) => {
    switch (elem.getAttribute("number")) {
      case "0":
        newCards[0] = elem.cloneNode(true);
        newCards[0].setAttribute("number", "5");
        newCards[0].classList.add("pets-in-zoo-block-card_last");
        break;
      case "1":
        newCards[5] = elem.cloneNode(true);
        newCards[5].setAttribute("number", "0");
        break;
      case "2":
        newCards[4] = elem.cloneNode(true);
        newCards[4].classList.remove("pets-in-zoo-block-card_last-320");
        newCards[4].setAttribute("number", "1");
        break;
      case "3":
        newCards[3] = elem.cloneNode(true);
        newCards[3].setAttribute("number", "2");
        break;
      case "4":
        newCards[2] = elem.cloneNode(true);
        newCards[2].classList.remove("pets-in-zoo-block-card_last");
        newCards[2].classList.add("pets-in-zoo-block-card_last-320");
        newCards[2].setAttribute("number", "3");
        break;
      case "5":
        newCards[1] = elem.cloneNode(true);
        newCards[1].setAttribute("number", "4");
        break;
    }
  });
  avalibleCards.forEach((elem) => {
    elem.style.transform = `translate(0px,-${cardBox.offsetHeight}px)`;
    setTimeout(() => {
      elem.style.transition = "0.4s linear";
      elem.style.transform = `translate(-400%, -${cardBox.offsetHeight}px)`;
    }, 10);
    setTimeout(() => {
      elem.style.transition = "0s linear";
      elem.remove();
    }, 410);
  });
  newCards.forEach((elem) => {
    elem.style.pointerEvents = "none";
    buttonLeftArrowPets.after(elem);
    elem.style.transform = `translate(400%,0px)`;
    setTimeout(() => {
      elem.style.transition = "0.4s linear";
      elem.style.transform = `translate(0px,0px)`;
    }, 10);
    setTimeout(() => {
      elem.style.transition = "0s linear";
      readyPets = true;
      cardBlock.style.overflow = "visible";
      elem.style.pointerEvents = "unset";
    }, 410);
  });
};

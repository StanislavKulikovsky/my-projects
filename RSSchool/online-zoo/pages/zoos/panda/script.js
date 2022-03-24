const translationsSide = document.querySelector(".translations__side-cameras");
const buttonLike = document.querySelector(".translations__top-button-like");
const heart = document.querySelector(".translations__top-button .hearth");
const rect = document.querySelector(".translations__top-button-like rect");

if (
  document.querySelector(".translations__main-iframe").getAttribute("liked") ==
  "true"
) {
  heart.style.fill = "#ff5656";
} else {
  heart.style.fill = "#ffffff";
}

translationsSide.addEventListener("click", (elem) => {
  if (elem.target.classList.contains("translation__iframe-holder")) {
    const tempClass = elem.target.parentNode.querySelector("iframe").className;
    document
      .querySelector(".translations__main-cameras")
      .appendChild(elem.target.parentNode.querySelector("iframe"));
    elem.target.parentNode.appendChild(
      document.querySelector(".translations__main-iframe")
    );
    document.querySelector(".translations__main-iframe").className = tempClass;
    document.querySelector(".translations__main-cameras iframe").className =
      "translations__main-iframe";
    if (
      document
        .querySelector(".translations__main-iframe")
        .getAttribute("liked") == "true"
    ) {
      heart.style.fill = "#ff5656";
      rect.style.fill = "#ffaaaa";
    } else {
      heart.style.fill = "#ffffff";
      rect.style.fill = "none";
    }
  }
});

buttonLike.onclick = () => {
  if (
    document
      .querySelector(".translations__main-iframe")
      .getAttribute("liked") == "false"
  ) {
    heart.style.fill = "#ff5656";
    rect.style.fill = "#ffaaaa";

    document
      .querySelector(".translations__main-iframe")
      .setAttribute("liked", "true");
  } else {
    heart.style.fill = "#ffffff";
    rect.style.fill = "none";
    document
      .querySelector(".translations__main-iframe")
      .setAttribute("liked", "false");
  }
};

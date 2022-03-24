const filtersContainer = document.querySelector(".filters");
const filtersLabels = document.querySelectorAll(".filters label");
const filtersInputs = document.querySelectorAll(".filters label input");
const imageShow = document.querySelector(".editor img");
const buttonFullscreen = document.querySelector(".fullscreen");
const buttonsContainer = document.querySelector(".btn-container");
const buttons = document.querySelectorAll(".btn-container .btn");
const inputLoad = document.querySelector(".btn-load--input");
const urlBase =
  "https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/";
const dayPeriod = getDayPeriod();
let imageNumber = 0;
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const imgToSave = new Image();
const filtersValues = {
  blur: 0,
  invert: 0,
  sepia: 0,
  saturate: 100,
  hue: 0,
};
let blurCoef = 520 / 1.2 / 750;

inputLoad.addEventListener("change", (elem) => {
  const file = inputLoad.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    imageShow.src = reader.result;
  };
  reader.readAsDataURL(file);
});

function drawCanvas() {
  ctx.filter = `blur(${filtersValues.blur}px) invert(${filtersValues.invert}%) sepia(${filtersValues.sepia}%) 
                  saturate(${filtersValues.saturate}%) hue-rotate(${filtersValues.hue}deg)`;
  ctx.drawImage(imgToSave, 0, 0);
}

imageShow.addEventListener("load", () => {
  imgToSave.src = imageShow.src;
  imgToSave.onload = function () {
    canvas.width = imgToSave.naturalWidth;
    canvas.height = imgToSave.naturalHeight;
    blurCoef = 520 / 1.2 / imgToSave.naturalHeight;
    if (filtersValues.blur > 0) {
      temp = (filtersValues.blur / blurCoef).toFixed(1);
      canvas.width = imgToSave.naturalWidth + temp * 0;
      canvas.height = imgToSave.naturalHeight + temp * 0;
      ctx.translate(temp * 0.0, temp * 0.0);
    }
    drawCanvas();
  };
});

buttonsContainer.addEventListener("click", (elem) => {
  if (elem.target.classList.contains("btn-reset")) {
    resetFilters();
    changeActiveButton(elem.target);
  } else if (elem.target.classList.contains("btn-next")) {
    nextImage();
    changeActiveButton(elem.target);
  } else if (elem.target.parentNode.classList.contains("btn-load")) {
    changeActiveButton(elem.target.parentNode);
  } else if (elem.target.classList.contains("btn-save")) {
    saveImage();
    changeActiveButton(elem.target);
  }
});

function resetFilters() {
  imageShow.style.setProperty("--blur", "0px");
  imageShow.style.setProperty("--invert", "0%");
  imageShow.style.setProperty("--sepia", "0%");
  imageShow.style.setProperty("--saturate", "100%");
  imageShow.style.setProperty("--hue", "0deg");
  filtersInputs.forEach((elem) => {
    if (elem.name === "saturate") {
      elem.value = 100;
    } else {
      elem.value = 0;
    }
    elem.parentNode.querySelector("output").value = elem.value;
  });
  filtersValues.blur = 0;
  filtersValues.invert = 0;
  filtersValues.sepia = 0;
  filtersValues.saturate = 100;
  filtersValues.hue = 0;
  canvas.width = imgToSave.naturalWidth;
  canvas.height = imgToSave.naturalHeight;
  drawCanvas();
}

function nextImage() {
  imgToSave.setAttribute("crossOrigin", "anonymous");
  imageNumber = imageNumber < 20 ? ++imageNumber : 1;
  const imageNumberText =
    imageNumber < 10 ? `0${imageNumber}` : `${imageNumber}`;
  imageShow.src = urlBase + dayPeriod + "/" + imageNumberText + ".jpg";
}

function saveImage() {
  const link = document.createElement("a");
  link.download = "download.png";
  link.href = canvas.toDataURL();
  link.click();
  link.delete;
}

function changeActiveButton(elem) {
  buttons.forEach((el) => {
    if (el.classList.contains("btn-active")) {
      el.classList.remove("btn-active");
    }
  });
  elem.classList.add("btn-active");
}

filtersContainer.addEventListener("input", (elem) => {
  elem.target.parentNode.querySelector("output").value = elem.target.value;
  imageShow.style.setProperty(
    "--" + elem.target.name,
    elem.target.value + elem.target.getAttribute("data-sizing")
  );
  let temp = elem.target.value;
  if (elem.target.name === "blur") {
    temp = elem.target.value / blurCoef;
    canvas.width = imgToSave.naturalWidth + temp * 0;
    canvas.height = imgToSave.naturalHeight + temp * 0;
    ctx.translate(temp * 0.0, temp * 0.0);
  }
  filtersValues[elem.target.name] = temp;
  drawCanvas();
});

function getDayPeriod() {
  let date = new Date();
  let hours = date.getHours();
  return hours < 6
    ? "night"
    : hours < 12
    ? "morning"
    : hours < 18
    ? "day"
    : "evening";
}

buttonFullscreen.addEventListener("click", () => {
  if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  } else if (document.documentElement.mozRequestFullscreen) {
    document.documentElement.mozRequestFullscreen();
  } else if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
  if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozExitFullscreen) {
    document.mozExitFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
});

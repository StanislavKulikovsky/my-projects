let mapX = 0;
let mapY = 0;
let clickX = 0;
let clickY = 0;
let moveX = 0;
let moveY = 0;

let zoom = 1;
const map = document.querySelector(".map__box");
const mapWrapper = document.querySelector(".map__wrapper");
const icons = document.querySelectorAll(".map__box a");
const mapItems = document.querySelectorAll(".map__item");

const buttonZoomPlus = document.querySelector(".map__zoomer-button-plus");
const buttonZoomMinus = document.querySelector(".map__zoomer-button-minus");

buttonZoomPlus.onclick = () => {
  if (zoom < 8) {
    zoom += 0.2;
    mapX = (mapX / (zoom - 0.2)) * zoom;
    mapY = (mapY / (zoom - 0.2)) * zoom;
  }
  mapItems.forEach((elem) => {
    elem.style.transform = `scale(${1 / zoom})`;
  });
  map.style.transform = `translate(${mapX}px,${mapY}px) scale(${zoom})`;
};
buttonZoomMinus.onclick = () => {
  if (map.offsetWidth * zoom > mapWrapper.offsetWidth) {
    zoom -= 0.2;
    mapX = (mapX / (zoom + 0.2)) * zoom;
    mapY = (mapY / (zoom + 0.2)) * zoom;
  }
  mapItems.forEach((elem) => {
    elem.style.transform = `scale(${1 / zoom})`;
  });
  map.style.transform = `translate(${mapX}px,${mapY}px) scale(${zoom})`;
};

mapWrapper.addEventListener("mousedown", (elem) => {
  clickX = elem.clientX;
  clickY = elem.clientY;
  mapWrapper.addEventListener("mousemove", mapMove);
});
document.addEventListener("mouseup", () => {
  mapX += moveX;
  mapY += moveY;
  mapWrapper.removeEventListener("mousemove", mapMove);
  icons.forEach((elem) => {
    elem.style.pointerEvents = "unset";
  });
  clickX = 0;
  clickY = 0;
  moveX = 0;
  moveY = 0;
});
function mapMove(elem) {
  icons.forEach((elem) => {
    elem.style.pointerEvents = "none";
  });
  moveX = elem.clientX - clickX;
  moveY = elem.clientY - clickY;
  map.style.transform = `translate(${mapX + moveX}px,${mapY + moveY}px) 
  scale(${zoom})`;
}

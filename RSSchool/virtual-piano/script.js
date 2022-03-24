const btnContainer = document.querySelector(".btn-container");
const btns = document.querySelectorAll(".btn");
const pianoKeys = document.querySelectorAll(".piano-key");
const piano = document.querySelector(".piano");
const fullscreenButton = document.querySelector(".fullscreen");

btnContainer.addEventListener("click", (elem) => {
  if (elem.target.classList.contains("btn")) {
    if (!elem.target.classList.contains("btn-active")) {
      btns.forEach((el) => {
        if (el.classList.contains("btn-active")) {
          el.classList.remove("btn-active");
        }
      });
      elem.target.classList.add("btn-active");
      if (elem.target.classList.contains("btn-notes")) {
        pianoKeys.forEach((el) => {
          el.classList.remove("piano-key-letter");
        });
      } else if (elem.target.classList.contains("btn-letters")) {
        pianoKeys.forEach((el) => {
          el.classList.add("piano-key-letter");
        });
      }
    }
  }
});

piano.addEventListener("mousedown", (el) => {
  if (el.target.classList.contains("piano-key")) {
    pianoKeyPress(el);
  }
  pianoKeys.forEach((elem) => {
    elem.addEventListener("mouseover", pianoKeyPress);
    elem.addEventListener("mouseout", pianoKeyRelease);
  });
});

document.addEventListener("mouseup", () => {
  pianoKeys.forEach((elem) => {
    elem.removeEventListener("mouseover", pianoKeyPress);
    elem.removeEventListener("mouseout", pianoKeyRelease);
    elem.classList.remove("piano-key-active");
  });
});

function pianoKeyPress(elem) {
  elem.target.classList.add("piano-key-active");
  const note = elem.target.dataset.note;
  const src = `assets/audio/${note}.mp3`;
  playNote(src);
}

function pianoKeyRelease(elem) {
  elem.target.classList.remove("piano-key-active");
}

function playNote(src) {
  const audio = new Audio();
  audio.src = src;
  audio.currentTime = 0;
  audio.play();
}

window.addEventListener("keydown", (elem) => {
  if (elem.repeat == true) {
    return;
  }
  let pressedKey = 0;
  switch (elem.code) {
    case "KeyD":
      pressedKey = "D";
      break;
    case "KeyF":
      pressedKey = "F";
      break;
    case "KeyG":
      pressedKey = "G";
      break;
    case "KeyH":
      pressedKey = "H";
      break;
    case "KeyJ":
      pressedKey = "J";
      break;
    case "KeyK":
      pressedKey = "K";
      break;
    case "KeyL":
      pressedKey = "L";
      break;
    case "KeyR":
      pressedKey = "R";
      break;
    case "KeyT":
      pressedKey = "T";
      break;
    case "KeyU":
      pressedKey = "U";
      break;
    case "KeyI":
      pressedKey = "I";
      break;
    case "KeyO":
      pressedKey = "O";
      break;
    default:
      return;
      break;
  }
  pianoKeys.forEach((el) => {
    if (el.dataset.letter === pressedKey) {
      el.classList.add("piano-key-active");
      const note = el.dataset.note;
      const src = `assets/audio/${note}.mp3`;
      playNote(src);
      return;
    }
  });
});

window.addEventListener("keyup", (elem) => {
  let pressedKey = 0;
  switch (elem.code) {
    case "KeyD":
      pressedKey = "D";
      break;
    case "KeyF":
      pressedKey = "F";
      break;
    case "KeyG":
      pressedKey = "G";
      break;
    case "KeyH":
      pressedKey = "H";
      break;
    case "KeyJ":
      pressedKey = "J";
      break;
    case "KeyK":
      pressedKey = "K";
      break;
    case "KeyL":
      pressedKey = "L";
      break;
    case "KeyR":
      pressedKey = "R";
      break;
    case "KeyT":
      pressedKey = "T";
      break;
    case "KeyU":
      pressedKey = "U";
      break;
    case "KeyI":
      pressedKey = "I";
      break;
    case "KeyO":
      pressedKey = "O";
      break;
    default:
      return;
      break;
  }
  pianoKeys.forEach((el) => {
    if (el.dataset.letter === pressedKey) {
      el.classList.remove("piano-key-active");
      return;
    }
  });
});

fullscreenButton.addEventListener("click", () => {
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

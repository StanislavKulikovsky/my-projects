const signUp = document.querySelector(".header__sign-up-button");
const logIn = document.querySelector(".header__log-in-button");
const user = document.querySelector(".header__user-button");
const userTooltip = document.querySelector(".user-tooltip");
let logOutVisible = false;
let currentModal = {
  type: "none",
  active: false,
  div: undefined,
  close: () => {
    currentModal.div.remove();
  },
};

signUp.onclick = () => {
  createModal("SignUp");
  signUp.blur();
};

logIn.onclick = () => {
  createModal("LogIn");
  logIn.blur();
};

user.onclick = () => {
  createModal("LogIn");
  user.blur();
};

function createModal(type) {
  currentModal.type = type;
  switch (type) {
    case "SignUp":
      createDivAccount("SignUp");
      break;
    case "LogIn":
      createDivAccount("LogIn");
      break;
  }
  document.body.append(currentModal.div);
}

function createDivBg() {
  currentModal.div = document.createElement("div");
  currentModal.div.className = "modal-background";
  currentModal.div.addEventListener("click", (elem) => {
    if (elem.target === currentModal.div) {
      currentModal.close();
    }
  });
}

function createDivAccount(type) {
  createDivBg();
  const divAccount = document.createElement("div");
  const divAccountHeader = document.createElement("div");
  divAccountHeader.className = "modal-account_header";
  const modalLogo = document.createElement("img");
  modalLogo.src = "../../assets/images/modal-logo.svg";
  const divAccountSwitch = createDivAccountSwitch(type);
  const divAccountSocials = createDivAccountSocials(type);
  const divAccountForm = createDivAccountForm(type);
  switch (type) {
    case "SignUp":
      divAccount.className = "modal-account modal-account__sign-up";
      break;
    case "LogIn":
      divAccount.className = "modal-account modal-account__log-in";
      break;
  }
  currentModal.div.appendChild(divAccount);
  divAccount.appendChild(divAccountHeader);
  divAccountHeader.appendChild(modalLogo);
  divAccount.appendChild(divAccountSwitch);
  divAccount.appendChild(divAccountSocials);
  divAccount.appendChild(divAccountForm);
  addAccountCheckEvent(type);
}

function createDivAccountSwitch(type) {
  const divAccountSwitch = document.createElement("div");
  divAccountSwitch.className = "modal-account_switch";
  const buttonSignUp = document.createElement("button");
  buttonSignUp.textContent = "create account";
  buttonSignUp.onclick = () => {
    if (currentModal.type !== "SignUp") {
      currentModal.type = "SignUp";
      currentModal.div
        .querySelector(".modal-account")
        .classList.remove("modal-account__log-in");
      currentModal.div
        .querySelector(".modal-account")
        .classList.add("modal-account__sign-up");
      buttonLogIn.classList.remove("modal-account_switch-item__active");
      buttonSignUp.classList.add("modal-account_switch-item__active");

      currentModal.div.querySelector(".modal-account_socials").remove();
      currentModal.div
        .querySelector(".modal-account")
        .appendChild(createDivAccountSocials("SignUp"));

      currentModal.div.querySelector(".modal-account_form").remove();
      currentModal.div
        .querySelector(".modal-account")
        .appendChild(createDivAccountForm("SignUp"));
      addAccountCheckEvent("SignUp");
    }
  };
  const buttonLogIn = document.createElement("button");
  buttonLogIn.textContent = "log in";
  buttonLogIn.onclick = () => {
    if (currentModal.type !== "LogIn") {
      currentModal.type = "LogIn";
      currentModal.div
        .querySelector(".modal-account")
        .classList.remove("modal-account__sign-up");
      currentModal.div
        .querySelector(".modal-account")
        .classList.add("modal-account__log-in");
      buttonSignUp.classList.remove("modal-account_switch-item__active");
      buttonLogIn.classList.add("modal-account_switch-item__active");

      currentModal.div.querySelector(".modal-account_socials").remove();
      currentModal.div
        .querySelector(".modal-account")
        .appendChild(createDivAccountSocials("LogIn"));

      currentModal.div.querySelector(".modal-account_form").remove();
      currentModal.div
        .querySelector(".modal-account")
        .appendChild(createDivAccountForm("LogIn"));
      addAccountCheckEvent("LogIn");
    }
  };
  switch (type) {
    case "SignUp":
      buttonSignUp.className =
        "modal-account_switch-item modal-account_switch-sign-up modal-account_switch-item__active";
      buttonLogIn.className =
        "modal-account_switch-item modal-account_switch-log-in";
      break;
    case "LogIn":
      buttonSignUp.className =
        "modal-account_switch-item modal-account_switch-sign-up";
      buttonLogIn.className =
        "modal-account_switch-item modal-account_switch-log-in modal-account_switch-item__active";
      break;
  }
  divAccountSwitch.appendChild(buttonSignUp);
  divAccountSwitch.appendChild(buttonLogIn);
  return divAccountSwitch;
}

function createDivAccountSocials(type) {
  const divAccountSocials = document.createElement("div");
  divAccountSocials.className = "modal-account_socials";
  const buttonGoogle = document.createElement("button");
  buttonGoogle.className =
    "modal-account_socials-item modal-account_socials-google";
  buttonGoogle.addEventListener("click", () => {
    applyLogIn("Logged in with Google");
  });
  const buttonFacebook = document.createElement("button");
  buttonFacebook.className =
    "modal-account_socials-item modal-account_socials-facebook";
  buttonFacebook.addEventListener("click", () => {
    applyLogIn("Logged in with Facebook");
  });

  switch (type) {
    case "SignUp":
      buttonGoogle.textContent = "Google Sign in";
      buttonFacebook.textContent = "Facebook Sign in";
      break;
    case "LogIn":
      buttonGoogle.textContent = "Google Login";
      buttonFacebook.textContent = "Facebook Login";
      break;
  }
  divAccountSocials.appendChild(buttonGoogle);
  divAccountSocials.appendChild(buttonFacebook);
  return divAccountSocials;
}

function createDivAccountForm(type) {
  const divAccountForm = document.createElement("form");
  divAccountForm.className = "modal-account_form";
  switch (type) {
    case "SignUp":
      const labelNameSignUp = document.createElement("label");
      labelNameSignUp.for = "#input-name";
      labelNameSignUp.textContent = "name";
      labelNameSignUp.className = "modal-account_label";
      divAccountForm.appendChild(labelNameSignUp);
      const inputNameSignUp = document.createElement("input");
      inputNameSignUp.type = "text";
      inputNameSignUp.id = "input-name";
      inputNameSignUp.className = "modal-account_text-input";
      divAccountForm.appendChild(inputNameSignUp);

      const labelEmailSignUp = document.createElement("label");
      labelEmailSignUp.for = "#input-email";
      labelEmailSignUp.textContent = "email";
      labelEmailSignUp.className = "modal-account_label";
      divAccountForm.appendChild(labelEmailSignUp);
      const inputEmailSignUp = document.createElement("input");
      inputEmailSignUp.type = "email";
      inputEmailSignUp.id = "input-email";
      inputEmailSignUp.className = "modal-account_text-input";
      divAccountForm.appendChild(inputEmailSignUp);

      const labelPasswordSignUp = document.createElement("label");
      labelPasswordSignUp.for = "#input-password";
      labelPasswordSignUp.textContent = "password";
      labelPasswordSignUp.className = "modal-account_label";
      divAccountForm.appendChild(labelPasswordSignUp);
      const inputPasswordSignUp = document.createElement("input");
      inputPasswordSignUp.type = "password";
      inputPasswordSignUp.id = "input-password";
      inputPasswordSignUp.className = "modal-account_text-input";
      divAccountForm.appendChild(inputPasswordSignUp);

      const checkboxWrapper = document.createElement("div");
      checkboxWrapper.className = "modal-account_checkbox-wrapper";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "input-checkbox";
      checkbox.className = "modal-account_checkbox";
      checkboxWrapper.appendChild(checkbox);
      checkboxWrapper.append("Agree with the ");
      const linkAgreement = document.createElement("a");
      linkAgreement.textContent = "User Agreement";
      checkboxWrapper.appendChild(linkAgreement);
      checkboxWrapper.append(" and ");
      const linkPrivacy = document.createElement("a");
      linkPrivacy.textContent = "Privacy Policy";
      checkboxWrapper.appendChild(linkPrivacy);
      divAccountForm.appendChild(checkboxWrapper);

      const buttonSendSignUp = document.createElement("input");
      buttonSendSignUp.type = "submit";
      buttonSendSignUp.value = "Send";
      buttonSendSignUp.className =
        "modal-account_send-button modal-account_send-button_non-active";
      divAccountForm.appendChild(buttonSendSignUp);
      buttonSendSignUp.addEventListener("click", (event) => {
        event.preventDefault();
        applyLogIn(currentModal.div.querySelector("#input-name").value);
      });

      break;
    case "LogIn":
      const labelEmailLogIn = document.createElement("label");
      labelEmailLogIn.for = "#input-email";
      labelEmailLogIn.textContent = "email";
      labelEmailLogIn.className = "modal-account_label";
      divAccountForm.appendChild(labelEmailLogIn);
      const inputEmailLogIn = document.createElement("input");
      inputEmailLogIn.type = "email";
      inputEmailLogIn.id = "input-email";
      inputEmailLogIn.className = "modal-account_text-input";
      divAccountForm.appendChild(inputEmailLogIn);

      const labelPasswordLogIn = document.createElement("label");
      labelPasswordLogIn.for = "#input-password";
      labelPasswordLogIn.textContent = "password";
      labelPasswordLogIn.className = "modal-account_label";
      divAccountForm.appendChild(labelPasswordLogIn);
      const inputPasswordLogIn = document.createElement("input");
      inputPasswordLogIn.type = "password";
      inputPasswordLogIn.id = "input-password";
      inputPasswordLogIn.className = "modal-account_text-input";
      divAccountForm.appendChild(inputPasswordLogIn);

      const buttonSendLogIn = document.createElement("input");
      buttonSendLogIn.type = "submit";
      buttonSendLogIn.value = "Send";
      buttonSendLogIn.className =
        "modal-account_send-button modal-account_send-button_non-active";
      divAccountForm.appendChild(buttonSendLogIn);
      buttonSendLogIn.addEventListener("click", (event) => {
        event.preventDefault();
        if (
          currentModal.div.querySelector("#input-email").value ===
            "user@gmail.com" &&
          currentModal.div.querySelector("#input-password").value === "useruser"
        ) {
          applyLogIn("UserName");
        } else {
          alert("Incorrect email or password");
        }
      });

      break;
  }
  return divAccountForm;
}

function checkLogIn() {
  const email = currentModal.div.querySelector("#input-email").value;
  const password = currentModal.div.querySelector("#input-password").value;
  if (email && password) {
    currentModal.div
      .querySelector(".modal-account_send-button")
      .classList.remove("modal-account_send-button_non-active");
  } else if (
    !currentModal.div
      .querySelector(".modal-account_send-button")
      .classList.contains("modal-account_send-button_non-active")
  ) {
    currentModal.div
      .querySelector(".modal-account_send-button")
      .classList.add("modal-account_send-button_non-active");
  }
}

function checkSignUp() {
  const email = currentModal.div.querySelector("#input-email").value;
  const password = currentModal.div.querySelector("#input-password").value;
  const nameValue = currentModal.div.querySelector("#input-name").value;
  const checkbox = currentModal.div.querySelector("#input-checkbox").checked;

  if (email && password.length > 7 && nameValue && checkbox) {
    currentModal.div
      .querySelector(".modal-account_send-button")
      .classList.remove("modal-account_send-button_non-active");
  } else if (
    !currentModal.div
      .querySelector(".modal-account_send-button")
      .classList.contains("modal-account_send-button_non-active")
  ) {
    currentModal.div
      .querySelector(".modal-account_send-button")
      .classList.add("modal-account_send-button_non-active");
  }
}

function addAccountCheckEvent(type) {
  switch (type) {
    case "SignUp":
      currentModal.div
        .querySelector("#input-email")
        .addEventListener("input", checkSignUp);
      currentModal.div
        .querySelector("#input-password")
        .addEventListener("input", checkSignUp);
      currentModal.div
        .querySelector("#input-name")
        .addEventListener("input", checkSignUp);
      currentModal.div
        .querySelector("#input-checkbox")
        .addEventListener("input", checkSignUp);
      break;

      break;
    case "LogIn":
      currentModal.div
        .querySelector("#input-email")
        .addEventListener("input", checkLogIn);
      currentModal.div
        .querySelector("#input-password")
        .addEventListener("input", checkLogIn);
      break;
  }
}

function applyLogIn(userName) {
  logIn.style.position = "absolute";
  logIn.style.visibility = "hidden";
  signUp.style.position = "absolute";
  signUp.style.visibility = "hidden";
  user.style.position = "relative";
  user.style.visibility = "visible";
  const userContainer = document.querySelector(".header__button-item-user");
  userContainer.style.position = "relative";
  userContainer.style.visibility = "visible";

  userTooltip.querySelector("p").textContent = userName;
  userTooltip.style.display = "none";
  userTooltip.style.display = "unset";
  user.onclick = () => {
    if (!logOutVisible) {
      const logOutDiv = document.createElement("div");
      logOutDiv.className = "log-out";
      const logOutP = document.createElement("p");
      logOutP.textContent = "log out";
      logOutDiv.appendChild(logOutP);
      logOutDiv.onclick = () => {
        document.querySelector(".log-out").remove();
        logOutVisible = false;

        logIn.style.position = "relative";
        logIn.style.visibility = "visible";
        signUp.style.position = "relative";
        signUp.style.visibility = "visible";
        user.style.position = "absolute";
        user.style.visibility = "hidden";
        userTooltip.style.display = "none";
        const userContainer = document.querySelector(
          ".header__button-item-user"
        );
        userContainer.style.position = "absolute";
        userContainer.style.visibility = "hidden";
      };
      const watchBlock = document.querySelector(".watch-block");
      watchBlock.prepend(logOutDiv);
      logOutVisible = true;
    } else {
      document.querySelector(".log-out").remove();
      logOutVisible = false;
    }
  };
  currentModal.close();
}

function applyLogOut() {}

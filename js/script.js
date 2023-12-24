/**
 * Toggles the visibility of elements based on their IDs and checks/unchecks the privacy policy checkbox.
 * @param {string} elementId - The ID of the primary element to toggle.
 * @param {string} elementIdNone - The ID of the secondary element to toggle.
 */
function toggleCheckmark(elementId, elementIdNone) {
  const element = document.getElementById(elementId);
  const elementNone = document.getElementById(elementIdNone);
  const checkbox = document.getElementById("privacyPolicyCheckbox");

  if (element.classList.contains("d-none")) {
    element.classList.remove("d-none");
    elementNone.classList.add("d-none");
    checkbox.checked = false;
  } else {
    element.classList.add("d-none");
    elementNone.classList.remove("d-none");
    checkbox.checked = true;
  }
}

/**
 * Toggles the visibility of the signup and login sections.
 * @param {string} action - Determines the action to take, either "show" or "hide".
 */
function showSignUpHideSignUp(action) {
  if (action === "show") {
    document.getElementById("sign-up").classList.remove("d-none");
    document.getElementById("login").classList.add("d-none");
  } else if (action === "hide") {
    console.log("hier?");
    document.getElementById("sign-up").classList.add("d-none");
    document
      .getElementById("forgot-password-container")
      .classList.add("d-none");
    document.getElementById("login").classList.remove("d-none");
  }
}

/**
 * Toggles the visibility of the forgot password sections.
 * @param {string} mode - Determines the mode, either "forgot" or "reset".
 */
function showForgotPassword(mode) {
  if (mode === "forgot") {
    document
      .getElementById("forgot-password-container")
      .classList.remove("d-none");
    document.getElementById("login").classList.add("d-none");
  } else if (mode === "reset") {
    document
      .getElementById("forgot-password-container")
      .classList.add("d-none");
  }
}

/**
 * Validates if two password fields have the same value.
 * @returns {boolean} Returns true if passwords match, false otherwise.
 */
function validatePasswords() {
  const password1 = document.getElementById("ForgotPassword1").value;
  const password2 = document.getElementById("ForgotPassword2").value;
  const errorMessage = document.getElementById("register-error2");
  if (password1 !== password2) {
    showPopup("Your password does not match.");
    return false;
  } else {
    showPopup("The password has been changed");
    errorMessage.style.display = "none";
    return true;
  }
}

/**
 * Checks if the given email exists in the users list and toggles visibility of relevant sections.
 */
function checkUserEmail() {
  let passwordEmail = document.getElementById("passwordEmail").value;

  user = users.find((u) => u.email === passwordEmail);
  if (user) {
    // Wenn der Benutzer in der Liste gefunden wurde
    document
      .getElementById("forgot-password-container")
      .classList.add("d-none");
    document.getElementById("password-container").classList.remove("d-none");
  } else {
    showPopup(
      "This email address is not registered. Please check your input or register."
    );
  }
}

/**
 * Handles the submit action of the forgot password form.
 * @returns {boolean} Always returns false to prevent form submission.
 */
async function handleForgotPasswordFormSubmit() {
  await loadUsers();
  checkUserEmail();
  //return false;
}

/**
 * Validates if a user is defined. If not, redirects to the index page.
 */
function checkUserLogin() {
  if (user == undefined) {
    openPage("../index.html");
  }
}

/**
 * Redirects the browser to the specified page.
 * @param {string} page - The URL of the page to redirect to.
 */
function openPage(page) {
  window.location.href = page;
}

/**
 * Closes the current browser tab or window.
 *
 * @function
 * @returns {void}
 */
function closeCurrentTab() {
  window.close();
}

/**
 * Sets the local storage with the data of a guest user.
 */
async function setGuestUser() {
  user = "guest";
  sessionStorage.setItem(
    "authToken",
    "17463135f0dda16b5d9e5834273e447ee2dd587b"
  );
  await downloadTask();
  await downloadContact();
  sessionStorage.setItem("email", "guest@guest.de");
  sessionStorage.setItem("name", "guest");
  openPage("./html/summary.html");
}

/**
 * Displays a popup with the given text and optionally redirects to a specified URL
 *
 * @param {string} text The message to display in the popup.
 * @param {string} url Optional. The URL to redirect to after the popup disappears.
 */
function showPopupAndRedirect(text, url) {
  var popup = document.createElement("div");
  popup.textContent = text;
  popup.classList.add("popup");
  document.body.appendChild(popup);
  setTimeout(function () {
    popup.style.top = "30px";
  }, 100);
  setTimeout(function () {
    popup.style.top = "-100px";
    setTimeout(function () {
      document.body.removeChild(popup);
      if (url) {
        window.location.href = url;
      }
    }, 500);
  }, 3000);
}

/**
 * This function generates a popup window which is displayed in the top center
 *
 * @param {String} text text that should be displayed
 */
function showPopup(text) {
  var popup = document.createElement("div");
  popup.textContent = text;
  popup.classList.add("popup");
  document.body.appendChild(popup);
  setTimeout(function () {
    popup.style.top = "30px";
  }, 100);
  setTimeout(function () {
    popup.style.top = "-100px";
    setTimeout(function () {
      document.body.removeChild(popup);
    }, 500);
  }, 3000);
}

function openHTML(html) {
  location.href = html;
}

/**
 * Header
 */
function userNavbar() {
  let navbar = document.getElementById("navbar");
  if (navbar.classList.contains("d-none")) {
    navbar.classList.remove("d-none");
  } else {
    navbar.classList.add("d-none");
  }
}

/**
 * Create Header Name
 */
function createHeaderName() {
  for (let i = 0; i < contacts.length; i++) {
    const element = contacts[i];
    if (element.email == sessionStorage.email) {
      document.getElementById("header-icon").innerHTML = element.logogram;
      document.getElementById("header-icon").style.backgroundColor =
        element.hex_color;
    } else if (user == "guest") {
      document.getElementById("header-icon").innerHTML = "GU";
      document.getElementById("header-icon").style.backgroundColor = "#FFA64E";
    }
  }
}

/**
 * Load of info page the user
 */
async function initHelp() {
  await loadUserData();
  loadFromLocalStorageContacts();
}

/**
 * Displays a popup with confirmation text.
 * @param {string} text - The text to be displayed in the popup.
 */
function showPopupWithConfirmation(text) {
  var popup = createPopup(text);

  var deleteButton = createDeleteButton();
  deleteButton.addEventListener("click", function () {
    deleteUserAndNavigate();
  });
  popup.appendChild(deleteButton);

  var cancelButton = createCancelButton();
  cancelButton.addEventListener("click", function () {
    closePopupAndHideNavbar();
  });
  popup.appendChild(cancelButton);

  document.body.appendChild(popup);
  showPopupDeletet(popup);
}

/**
 * Creates a popup element with the specified text.
 * @param {string} text - The text to be displayed in the popup.
 * @returns {HTMLElement} The created popup element.
 */
function createPopup(text) {
  var popup = document.createElement("div");
  popup.classList.add("popup");
  var message = document.createElement("div");
  message.textContent = text;
  popup.appendChild(message);
  return popup;
}

/**
 * Creates a "Delete Account" button for the popup.
 * @returns {HTMLButtonElement} The created button.
 */
function createDeleteButton() {
  var deleteButton = createPopupButton("Delete Account");
  deleteButton.classList.add("popup-button-delete");
  deleteButton.classList.add("popup-button-delete-red");
  return deleteButton;
}

/**
 * Creates a "Cancel" button for the popup.
 * @returns {HTMLButtonElement} The created button.
 */
function createCancelButton() {
  var cancelButton = createPopupButton("Cancel");
  cancelButton.classList.add("popup-button-delete");
  return cancelButton;
}

/**
 * Creates a general popup button with the specified text.
 * @param {string} text - The text of the button.
 * @returns {HTMLButtonElement} The created button.
 */
function createPopupButton(text) {
  var button = document.createElement("button");
  button.textContent = text;
  return button;
}

/**
 * Displays the popup element.
 * @param {HTMLElement} popup - The popup element to be displayed.
 */
function showPopupDeletet(popup) {
  setTimeout(function () {
    popup.style.top = "30px";
  }, 100);
}

/**
 * Deletes the user and navigates to the home page.
 */
function deleteUserAndNavigate() {
  deleteUser();
  closePopup();
  setTimeout(function () {
    openPage("../index.html");
  }, 1000);
}

/**
 * Closes the popup and hides the navigation bar.
 */
function closePopupAndHideNavbar() {
  closePopup();
  document.getElementById("navbar").classList.add("d-none");
}

/**
 * Closes the popup.
 */
function closePopup() {
  var popup = document.querySelector(".popup");
  popup.style.top = "-100px";
  setTimeout(function () {
    document.body.removeChild(popup);
  }, 500);
}

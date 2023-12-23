let users = [];

/**
 * Initialize the application by loading users from local storage and any external source.
 * @returns {Promise<void>}
 */
async function init() {
  //loadUsersFromLocalStorage();
  //loadUsers();
}

/**
 * Save the current users array to local storage.
 */
function saveUsersToLocalStorage() {
  localStorage.setItem("users", JSON.stringify(users));
}

/**
 * Load users from local storage and update the users array.
 */
function loadUsersFromLocalStorage() {
  let storedUsers = localStorage.getItem("users");
  if (storedUsers) {
    users = JSON.parse(storedUsers);
  } else {
    users = [];
  }
}

/**
 * Load users from an external source, update the users array, and then save to local storage.
 * @returns {Promise<void>}
 */
async function loadUsers() {
  try {
    let parsedUsers = JSON.parse(await getItem("users"));
    if (Array.isArray(parsedUsers)) {
      users = parsedUsers;
    } else {
      users = [];
    }
  } catch (e) {}
}

/**
 * Handle the registration process for a new user.
 * @returns {Promise<void>}
 */
async function register() {
  if (!validateRegistrationFields()) {
    return;
  } else {
    await processRegistration();
  }
}

/**
 * Validate the registration form fields.
 * @returns {boolean} Whether the form fields are valid or not.
 */
function validateRegistrationFields() {
  let checkbox = document.getElementById("privacyPolicyCheckbox");
  if (!checkbox.checked) {
    showPopup("Please accept the privacy policy before proceeding.");
    return false;
  }
  let email = document.getElementById("emailregister").value;
  let password1 = document.getElementById("passwordregister1").value;
  let password2 = document.getElementById("passwordregister2").value;
  if (password1 !== password2) {
    showPopup("Your password does not match.");
    return false;
  }
  return true;
}

/**
 * Process the registration of a new user.
 * @returns {Promise<void>}
 */
async function processRegistration() {
  var splitNameResult = splitName(
    document.getElementById("nameregister").value
  );
  let email = document.getElementById("emailregister").value;
  let password1 = document.getElementById("passwordregister1").value;
  let password2 = document.getElementById("passwordregister2").value;
  var formdata = new FormData();
  formdata.append("username", email);
  formdata.append("first_name", splitNameResult.firstName);
  formdata.append("last_name", splitNameResult.lastName);
  formdata.append("password1", password1);
  formdata.append("email", email);
  formdata.append("password2", password2);
  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };
  await fetch(STORAGE_URL + "register/", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (JSON.stringify(result.ok) != undefined) {
        showPopup(JSON.stringify(result.ok).slice(1, -1));
        let registerBtn = document.getElementById("registerBtn");
        registerBtn.disabled = true;
        resetFormValue();
        setTimeout(() => {
          openPage("index.html");
        }, 3000);
      } else {
        showPopup(JSON.stringify(result.error).slice(1, -1));
      }
    })
    .catch((error) => console.log("Server failed", error));
}

/**
 * Reset the registration form values.
 */
function resetFormValue() {
  document.getElementById("nameregister").value = "";
  document.getElementById("emailregister").value = "";
  document.getElementById("passwordregister1").value = "";
  document.getElementById("passwordregister2").value = "";
  document.getElementById("registerBtn").disabled = false;
}

/**
 * Load a standard user list and contacts for the provided user and name.
 * @param {string} user - The email of the user.
 * @param {string} name - The name of the user.
 * @returns {Promise<void>}
 */
async function loadStandardUserListAndContacts(user, name) {
  let new_list = JSON.parse(await getItem("guest-list"));
  await setItem(user + "-list", new_list);
  let new_contact = JSON.parse(await getItem("guest-contacts"));
  addUserToContacts(user, name, new_contact);
  await setItem(user + "-contacts", new_contact);
}

/**
 * Add a user to the provided contacts list.
 * @param {string} user - The email of the user.
 * @param {string} name - The name of the user.
 * @param {Array} new_contact - The contacts list to which the user should be added.
 * @returns {number} The new length of the contacts list after adding the user.
 */
function addUserToContacts(user, name, new_contact) {
  if (user !== "guest") {
    let nameAlterd = name.charAt(0).toUpperCase() + name.slice(1);
    let ownContactData = {
      name: nameAlterd,
      email: user,
      phone: "",
      logogram: getLogogram(nameAlterd),
      hex_color: getContactColor(),
    };
    return new_contact.push(ownContactData);
  }
}

/**
 * Here the password is reset and the user can create a new one
 */
async function changePassword() {
  if (validatePasswords()) {
    let password = document.getElementById("ForgotPassword1").value;
    sendPasswordChangeRequest(password);
    setTimeout(() => {
      console.log("geht hier was");
      window.location.href = "../index.html";
    }, 2000);
  }
}

/**
 * Initiates a password reset process by sending a request to the server with the user's email.
 *
 * @function
 * @returns {void}
 * @throws {Error} Throws an error if there is an issue with the server request.
 */
function forgetPassword() {
  var email = document.getElementById("passwordEmail").value;
  fetch(STORAGE_URL + "reset_password/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success != undefined) {
        showPopup(data.success);
        setTimeout(() => {
          openPage("index.html");
        }, 3000);
      } else {
        showPopup(data.error);
      }
    })
    .catch((error) => {
      console.error("Fehler:", error);
    });
}

/**
 * Splits a full name into its first name and last name components.
 *
 * @function
 * @param {string} fullName - The full name to be split.
 * @returns {Object} An object containing the first name and last name components.
 * @property {string} firstName - The first name extracted from the full name.
 * @property {string} lastName - The last name extracted from the full name.
 */
function splitName(fullName) {
  var nameParts = fullName.split(" ");

  var firstName = nameParts[0];
  var lastName = nameParts.slice(1).join(" ");

  return { firstName, lastName };
}

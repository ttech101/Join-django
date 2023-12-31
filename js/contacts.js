// Create new Contact

/**
 * This function starts the necessary functions to create and save a new contact
 */

async function createNewContact() {
  if (user === "guest") {
    showPopup("Cannot be created as a guest. Please create an account");
    closeNewContacts();
  } else {
    if (validateFormEmail()) {
      await saveNewContact();
    } else {
      showPopup("Please enter the correct format for the email");
    }
  }
}

/**
 * Validates the email input in a form using a regular expression pattern.
 *
 * @function
 * @returns {boolean} Returns true if the email input is valid, otherwise false.
 */
function validateFormEmail() {
  var emailInput = document.getElementById("popup-contact-email");
  var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(emailInput.value)) {
    return false;
  }
  return true;
}

/**
 * Saving a new contact
 */
async function saveNewContact() {
  let contactName = document.getElementById("popup-contact-name");
  let contactEmail = document.getElementById("popup-contact-email");
  let contactPhone = document.getElementById("popup-contact-phone");
  let contactNameAlterd =
    contactName.value.charAt(0).toUpperCase() + contactName.value.slice(1);
  let logogram = getLogogram(contactNameAlterd);
  let contactColor = getContactColor();
  await saveNewContactValues(
    contactNameAlterd,
    contactEmail,
    contactPhone,
    logogram,
    contactColor
  );
  resetForm(contactName, contactEmail, contactPhone);
  closeNewContacts();
  if (
    document.URL.includes("add_task.html") ||
    document.URL.includes("board.html")
  ) {
    if (document.URL.includes("add_task.html")) {
      sortContactsList();
      renderAssignedToBt();
    }
  } else {
    updateContactsPage(contactNameAlterd);
  }
  showPopup("Contact succesfully created");
}

/**
 * This function saves the input form createNewContact() into an object and than into the contacts array.
 * The variable contacts is than save in localStorage and on the server.
 *
 * @param {string} contactNameAlterd This varable is the name of the new contact
 * @param {string} contactEmail This varable is the email of the new contact
 * @param {string} contactPhone This varable is the phone number of the new contact
 * @param {string} logogram This varable is the logogram of the new contacts icon
 * @param {string} contactColor This varable is the color of the new contacts icon
 */
async function saveNewContactValues(
  contactNameAlterd,
  contactEmail,
  contactPhone,
  logogram,
  contactColor
) {
  let newContact = {
    name: contactNameAlterd,
    email: contactEmail.value,
    phone: contactPhone.innerHTML,
    logogram: logogram,
    hex_color: contactColor,
  };
  await sendContact(
    contactEmail.value,
    contactColor,
    logogram,
    contactNameAlterd,
    contactPhone.value
  );
}

/**
 * This function empties the input fields
 *
 * @param {string} contactName This varable is the name of the new contact
 * @param {string} contactEmail This varable is the email of the new contact
 * @param {string} contactPhone This varable is the phone number of the new contact
 */
function resetForm(contactName, contactEmail, contactPhone) {
  contactName.value = "";
  contactEmail.value = "";
  contactPhone.value = "";
}

/**
 * This function creats the logogram form the name
 *
 * @param {string} name This variable is the name of the contact
 * @returns The first letters of the fist and last name
 */
function getLogogram(name) {
  let firstCha = name.toString().charAt(0);
  let secondCha = name
    .toString()
    .trim()
    .split(" ")
    .splice(-1)
    .toString()
    .charAt(0);
  return firstCha + secondCha;
}

/**
 * This function chooses randomly a color form the hexColor array
 *
 * @returns A color code
 */
function getContactColor() {
  let randomColor = hexColors[Math.floor(Math.random() * hexColors.length)];
  return randomColor;
}

/**
 * This function calls the render and showContact functions to show the changes
 *  that have been made.
 *
 * @param {string} contactNameAlterd This variable is the name of the contact
 */
function updateContactsPage(contactNameAlterd) {
  renderContacts();
  let index;
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const contactName = contact["name"];
    if (contactNameAlterd === contactName) {
      index = i;
    }
  }
  showContact(index);
}

// Delete Contacts

/**
 * This function starts the functions to remove a contact form the contacts array and saves the changes.
 *
 * @param {number} i This is the index of a contact
 */
async function deleteContacts(i) {
  if (user === "guest" || user === contacts[i]["email"]) {
    if (user === "guest") {
      showPopup("Cannot be deleted as a guest. Please create an account");
    } else {
      showPopup("Cannot be deleted.");
    }
    closeNewContacts();
  } else {
    // deleteFromList(i);
    // contacts.splice(i, 1);
    await deleteContact(i);
    await downloadContact();
    closeNewContacts();
    removeFromMainPage();
    showPopup("Contact deleted");
    renderContacts();
  }
}

/**
 * This function empties the html content form the container
 */
function removeFromMainPage() {
  document.getElementById("contact-clicked").innerHTML = "";
}

/**
 * This function looks for the tasks with the deleted contact and
 * deletes the contact form that task
 *
 * @param {number} i This variable is the index of the contact
 */
function deleteFromList(i) {
  let contactName = contacts[i]["name"];

  for (let j = 0; j < list.length; j++) {
    const task = list[j];
    const users = task["task_user"];

    for (let k = 0; k < users.length; k++) {
      const user = users[k];

      if (user["full_name"] === contactName) {
        changeUsersInTask(users, k, task, j);
      }
    }
  }
}

/**
 * This function defines all the elements of the choosen task again and removes the
 * choosen task_user. Than everything is send to saveChangedTask function.
 *
 * @param {object} users
 * @param {number} k This varibale is the index of user within the task_user object
 * @param {object} task
 * @param {number} j This variable is the index of the task within the list array
 */
function changeUsersInTask(users, k, task, j) {
  users.splice(k, 1);
  let id = task["id"];
  let taskTitle = task["headline"];
  let taskDescription = task["text"];
  let assignedTo = users;
  let dueDate = task["date"];
  taskPrio = task["priority"];
  let taskCategory = task["category"];
  subtasks = task["subtasks"];
  let taskBoard = task["task_board"];
  saveChangedTask(
    id,
    j,
    taskTitle,
    taskDescription,
    assignedTo,
    dueDate,
    taskCategory,
    taskBoard
  );
}

// Save changed contact

/**
 * This function starts the functions to change a contact within the contacts array and saves the changes.
 *
 * @param {number} i This is the index of the contact
 */
async function saveChangedContact(i) {
  if (user === "guest" || user === contacts[i]["email"]) {
    if (user === "guest") {
      showPopup("Cannot be changed as a guest. Please create an account");
    } else {
      showPopup("Cannot be changed.");
    }
    closeNewContacts();
  } else if (
    document.getElementById("check-formvalidation-contacts").checkValidity() &&
    validateFormEmail()
  ) {
    await saveChangedContactFunctions(i);
  } else {
    showPopup("Please enter the correct format for the email");
    document.getElementById("check-formvalidation-contacts").reportValidity();
  }
}

/**
 * This functin calls all the functions to save the changes.
 */
async function saveChangedContactFunctions(i) {
  let contactName = document.getElementById("popup-contact-name");
  let contactEmail = document.getElementById("popup-contact-email");
  let contactPhone = document.getElementById("popup-contact-phone");
  let contactNameAlterd =
    contactName.value.charAt(0).toUpperCase() + contactName.value.slice(1);
  let logogram = getLogogram(contactNameAlterd);
  let contactColor = getContactColor();
  let id = contacts[i].id;
  await updateContact(
    id,
    contactEmail.value,
    contactColor,
    logogram,
    contactNameAlterd,
    contactPhone.value
  );
  renderContacts();
  resetForm(contactName, contactEmail, contactPhone);
  closeNewContacts();
  showContact(i);
  showPopup("Contact changed");
}

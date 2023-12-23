const STORAGE_URL = "http://localhost:8000/";
let user; // Creation of users variable
let list; //Creation of list variable
let contacts; //Creation of contact variable
let listString = "list"; //Creation of liststring variable
let contactsString = "contacts"; //Creation of contactstring variable

/**
 * This function saves data on the server under a key
 *
 * @param {String} key  Key for storing
 * @param {JSON} value  JSON to key
 * @returns             returns a status
 */
async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

/**
 * This function loads data from the server. The key must be set here
 *
 * @param {String} key   Key for storing
 * @returns         return a JSON
 */
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.data) {
        return res.data.value;
      }
      throw `${key} not found`;
    });
}

/**
 * This function saves the user data in the local storage and on the server
 *
 * @param {String} users        User
 * @param {String} keyString    key as string
 * @param {String} dataObject   dataobject as string
 */
async function SaveInLocalStorageAndServer(keyString, dataObject) {
  let dataAsText = JSON.stringify(dataObject); // variable list or contacts
  sessionStorage.setItem(keyString, dataAsText);
}

/**
 * This function loads the tasks data
 */
function loadFromLocalStorage() {
  let listAsText = sessionStorage.getItem("tasks");
  if (listAsText) {
    list = JSON.parse(listAsText);
  }
}

/**
 * This function loads the contact data
 */
function loadFromLocalStorageContacts() {
  let dataAsText = sessionStorage.getItem("contacts");
  if (dataAsText) {
    contacts = JSON.parse(dataAsText);
  }
}

/**
 * This function loads the logged in user. If the user is a guest, the guest user is loaded
 */
async function loadUserData() {
  if (sessionStorage.getItem("authToken") == null) {
    user = null;
  } else {
    user_name = sessionStorage.getItem("name");
    user = true;
    if (user_name == undefined) {
      user_name = "Guest";
    }
  }
}

/**
 * This function deletes the local storage
 */
function clearLocalStorage() {
  sessionStorage.clear();
}

function headerRequest() {
  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Token " + sessionStorage.getItem("authToken")
  );
  return myHeaders;
}

/**
 * Asynchronously sends contact information to the server and triggers a download of updated contact data.
 *
 * @function
 * @async
 * @param {string} email - The email address of the contact.
 * @param {string} hex_color - The hexadecimal color code associated with the contact.
 * @param {File} logogram - The logogram file representing the contact.
 * @param {string} name - The name of the contact.
 * @param {string} phone_number - The phone number of the contact.
 * @returns {Promise<void>} A promise that resolves after sending the contact information and downloading updated contact data.
 * @throws {Error} Throws an error if there is an issue with the server request.
 */
async function sendContact(email, hex_color, logogram, name, phone_number) {
  var myHeaders = headerRequest();
  var formdata = new FormData();
  formdata.append("email", email);
  formdata.append("hex_color", hex_color);
  formdata.append("logogram", logogram);
  formdata.append("name", name);
  formdata.append("phone_number", phone_number);
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };
  await fetch(STORAGE_URL + "contact/", requestOptions)
    .then((response) => response.text())
    .catch((error) => console.log("error", error));
  await downloadContact();
}

/**
 * Asynchronously downloads contact data from the server and updates the session storage.
 *
 * @function
 * @async
 * @returns {Promise<void>} A promise that resolves after downloading and updating contact data.
 * @throws {Error} Throws an error if there is an issue with the server request.
 */
async function downloadContact() {
  var myHeaders = headerRequest();

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  await fetch(STORAGE_URL + "contact/", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      let contact = JSON.stringify(result);
      contacts = result;
      sessionStorage.setItem("contacts", contact);
    })
    .catch((error) => console.log("error", error));
}

/**
 * Asynchronously deletes a contact from the server based on the provided index.
 *
 * @function
 * @async
 * @param {number} i - The index of the contact to be deleted.
 * @returns {Promise<void>} A promise that resolves after successfully deleting the contact.
 * @throws {Error} Throws an error if there is an issue with the server request.
 */
async function deleteContact(i) {
  var myHeaders = headerRequest();
  id = contacts[i].id;

  var requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    body: "",
    redirect: "follow",
  };
  await fetch(STORAGE_URL + "contact/" + id + "/", requestOptions)
    .then((response) => response.text())
    .catch((error) => console.log("error", error));
}

/**
 * Asynchronously updates a contact on the server with the provided information.
 *
 * @function
 * @async
 * @param {number} id - The ID of the contact to be updated.
 * @param {string} email - The updated email address of the contact.
 * @param {string} hex_color - The updated hexadecimal color code associated with the contact.
 * @param {File} logogram - The updated logogram file representing the contact.
 * @param {string} name - The updated name of the contact.
 * @param {string} phone_number - The updated phone number of the contact.
 * @returns {Promise<void>} A promise that resolves after successfully updating the contact and downloading updated contact data.
 * @throws {Error} Throws an error if there is an issue with the server request.
 */
async function updateContact(
  id,
  email,
  hex_color,
  logogram,
  name,
  phone_number
) {
  var myHeaders = headerRequest();
  var formdata = new FormData();
  formdata.append("email", email);
  formdata.append("hex_color", hex_color);
  formdata.append("logogram", logogram);
  formdata.append("name", name);
  formdata.append("phone_number", phone_number);
  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };
  await fetch(STORAGE_URL + "contact/" + id + "/", requestOptions)
    .then((response) => response.text())
    .catch((error) => console.log("error", error));
  await downloadContact();
}

/**
 * Asynchronously sends a new task to the server with the provided information.
 *
 * @function
 * @async
 * @param {string} headline - The headline or title of the task.
 * @param {string} text - The description or details of the task.
 * @param {string} task_user - The user assigned to the task.
 * @param {string} date - The due date of the task.
 * @param {string} category - The category or type of the task.
 * @param {string} idBox - The ID of the task box associated with the task.
 * @param {string} task_board - The task board to which the task belongs.
 * @returns {Promise<void>} A promise that resolves after successfully sending the new task and downloading updated task data.
 * @throws {Error} Throws an error if there is an issue with the server request.
 */
async function sendTask(
  headline,
  text,
  task_user,
  date,
  category,
  idBox,
  task_board
) {
  let subtask = checkSubTask();
  var myHeaders = headerRequest();
  var formdata = new FormData();
  formdata.append("idBox", idBox);
  formdata.append("headline", headline.value);
  formdata.append("text", text.value);
  formdata.append("date", date.value);
  formdata.append("priority", taskPrio);
  formdata.append("category", category);
  formdata.append("subtasks", subtask);
  formdata.append("task_user", task_user);
  formdata.append("task_board", task_board);
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };
  await fetch(STORAGE_URL + "task/", requestOptions)
    .then((response) => response.text())
    .catch((error) => console.log("error", error));
  await downloadTask();
}

/**
 * Converts an array of subtasks to a JSON string.
 *
 * @function
 * @returns {string} A JSON string representing the array of subtasks.
 */
function checkSubTask() {
  return JSON.stringify(subtasks);
}

/**
 * Asynchronously downloads task data from the server and updates the session storage.
 *
 * @function
 * @async
 * @returns {Promise<void>} A promise that resolves after downloading and updating task data.
 * @throws {Error} Throws an error if there is an issue with the server request.
 */
async function downloadTask() {
  var myHeaders = headerRequest();
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  await fetch(STORAGE_URL + "task/", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      let jsonTask = JSON.stringify(result);
      list = result;
      sessionStorage.setItem("tasks", jsonTask);
    })
    .catch((error) => console.log("error", error));
}

/**
 * Asynchronously deletes a task from the server based on the provided ID.
 *
 * @function
 * @async
 * @param {number} id - The ID of the task to be deleted.
 * @returns {Promise<void>} A promise that resolves after successfully deleting the task and downloading updated task data.
 * @throws {Error} Throws an error if there is an issue with the server request.
 */
async function deleteTasks(id) {
  var myHeaders = headerRequest();
  var requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    body: "",
    redirect: "follow",
  };
  await fetch(STORAGE_URL + "task/" + id + "/", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
  await downloadTask();
}

/**
 * Asynchronously updates a task on the server with the provided information.
 *
 * @function
 * @async
 * @param {string} headline - The updated headline or title of the task.
 * @param {string} text - The updated description or details of the task.
 * @param {string} task_user - The updated user assigned to the task.
 * @param {string} date - The updated due date of the task.
 * @param {string} category - The updated category or type of the task.
 * @param {string} idBox - The updated ID of the task box associated with the task.
 * @param {string} task_board - The updated task board to which the task belongs.
 * @param {number} id - The ID of the task to be updated.
 * @returns {Promise<void>} A promise that resolves after successfully updating the task and downloading updated task data.
 * @throws {Error} Throws an error if there is an issue with the server request.
 */
async function updateTask(
  headline,
  text,
  task_user,
  date,
  category,
  idBox,
  task_board,
  id
) {
  let subtask = checkSubTask();
  var myHeaders = headerRequest();
  var formdata = new FormData();
  formdata.append("idBox", idBox);
  formdata.append("headline", headline);
  formdata.append("text", text);
  formdata.append("date", date);
  formdata.append("priority", taskPrio);
  formdata.append("category", category);
  formdata.append("subtasks", subtask);
  formdata.append("task_user", task_user);
  formdata.append("task_board", task_board);
  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };
  await fetch(STORAGE_URL + "task/" + id + "/", requestOptions)
    .then((response) => response.text())
    .catch((error) => console.log("error", error));
  await downloadTask();
}

/**
 * Deletes the current user account on the server.
 *
 * @function
 * @returns {void}
 */
function deleteUser() {
  let token = "Token " + sessionStorage.getItem("authToken");
  fetch(STORAGE_URL + "delete_current_user/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Benutzer erfolgreich gelöscht");
      } else {
        console.error(`Fehler beim Löschen des Benutzers: ${data.error}`);
      }
    })
    .catch((error) => console.error("Fehler beim Senden des Requests:", error));
}

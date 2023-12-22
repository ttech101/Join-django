//const STORAGE_TOKEN = "TOU51R21M1ZJUBNEVP1Q5YFN1UVMEURVYQ27V9AJ"; //The tocken to the server storage
//const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';  //The URL to the server storage
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
 */
async function SaveDataInLocalStorageFromServer(users, keyString) {
  let data = await JSON.parse(await getItem(users + `-${keyString}`));
  let dataAsText = JSON.stringify(data);
  localStorage.setItem(keyString, dataAsText);
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
  // await setItem(keyString, dataObject);
}

// async function SaveInLocalStorageAndServer(users, keyString, dataObject) {
//   let dataAsText = JSON.stringify(dataObject); // variable list or contacts
//   sessionStorage.setItem(keyString, dataAsText);
//   await setItem(users + `-${keyString}`, dataObject);
// }

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
    // .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  await downloadContact();
}

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
    // .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

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
    // .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  await downloadContact();
}

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
    //.then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  await downloadTask();
}

function checkSubTask() {
  return JSON.stringify(subtasks);
}

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
    // .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  await downloadTask();
}

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

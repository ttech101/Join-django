/**
 * This function starts the functions to load all the necessary data
 */
async function initAddTask() {
  loadAddTaskForm();
  await loadUserData();
  checkUserLogin();
  loadFromLocalStorage();
  loadFromLocalStorageContacts();
  loadStringFromLocalStorage();
}

/**
 * Load Add Task Form Element
 */
function loadAddTaskForm() {
  let AddTaskForm = document.getElementById("task-input-con");
  AddTaskForm.innerHTML = "";
  let todayDate = getCurrentDate();
  AddTaskForm.innerHTML = createAddTask(todayDate);
}

/**
 * This function handles the appearance of the assigned to Button
 */
function showAssignedToBt() {
  document
    .getElementById("task-contacts-list-to-assign")
    .classList.remove("d-none");
  document.getElementById("add-new-contact-bt").classList.remove("d-none");
  contactsListToAssignCon = document.getElementById(
    "task-contacts-list-to-assign"
  );
  if (!contacts) {
    contactsListToAssignCon.innerHTML = "";
    contactsListToAssignCon.innerHTML = /*html*/ `<p>&emsp; No contacts yet</p>`;
  } else {
    sortContactsList();
    renderAssignedToBt();
  }
}

/**
 * This function generates the html code for the assigned to Button with all the saved contacts.
 *
 * @param {string} serch serch assit user
 */
function renderAssignedToBt(serch) {
  let contactsListToAssignCon = document.getElementById(
    "task-contacts-list-to-assign"
  );
  contactsListToAssignCon.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (contact.name.toLowerCase().includes(serch) || serch == undefined) {
      if (contact.check) {
        contactsListToAssignCon.innerHTML += createAssignedToBt(
          i,
          contact,
          "checked"
        );
      } else {
        contactsListToAssignCon.innerHTML += createAssignedToBt(i, contact, "");
      }
    }
  }
}

/**
 * This function looks for the assit users
 */
function serchAssitUser() {
  let serchValue = document.getElementById("serchAssitUserValue").value;
  serchValue = serchValue.toLowerCase();
  renderAssignedToBt(serchValue);
}

/**
 * This function determines the checked of the individual Assist users
 *
 * @param {number} i index of assist user
 */
function checkedAssist(i) {
  for (let j = 0; j < contacts.length; j++) {
    const element = contacts[j];
    if (i == j) {
      if (
        document.getElementById(`contact-${i}`).checked &&
        document.getElementById(`task-assist-${element.email}`) == null
      ) {
        element.check = "checked";
        document.getElementById("add-task-assist").innerHTML += `
                    <div id='task-assist-${element.email}' style="background-color:${element["hex_color"]};" class="task-contacts-color-icon-assist">${element["logogram"]} </div>`;
      } else if (
        document.getElementById(`contact-${i}`).checked &&
        document.getElementById(`task-assist-${element.email}`) != null
      ) {
        document
          .getElementById(`task-assist-${element.email}`)
          .classList.remove("dn");
        element.check = "checked";
      } else if (document.getElementById("add-task-assist")) {
        element.check = "";
        document
          .getElementById(`task-assist-${element.email}`)
          .classList.add("dn");
      }
    }
  }
  renderAssignedToBt();
}

/**
 * This function checks the assit users that have already been set
 *
 * @param {number} i index ob task
 */

function loadCheckedAssist(i) {
  if (user == "guest") return;
  document.getElementById("add-task-assist").innerHTML = "";
  for (let k = 0; k < list.length; k++) {
    const element_task = list[k];
    if (element_task.id == i) {
      for (let h = 0; h < element_task.task_user.length; h++) {
        const element = element_task.task_user[h];
        for (let k = 0; k < contacts.length; k++) {
          const contact = contacts[k];
          if (element.mail == contact.email) {
            document.getElementById("add-task-assist").innerHTML += `
                      <div id='task-assist-${contact.email}' style="background-color:${element["color"]};" class="task-contacts-color-icon-assist">${element["name"]}
                      </div>`;
            contact.check = "checked";
          }
        }
      }
    }
  }
}

// function loadCheckedAssist(i) {
//   console.warn(i);
//   if (user == "guest") return;

//   document.getElementById("add-task-assist").innerHTML = "";
//   for (let h = 0; h < list[i]["task_user"].length; h++) {
//     const element = list[i]["task_user"][h];
//     for (let k = 0; k < contacts.length; k++) {
//       const contact = contacts[k];
//       if (element.mail == contact.email) {
//         document.getElementById("add-task-assist").innerHTML += `
//                     <div id='task-assist-${contact.email}' style="background-color:${element["color"]};" class="task-contacts-color-icon-assist">${element["name"]}
//                     </div>`;
//         contact.check = "checked";
//       }
//     }
//   }
// }

/**
 * This function closes the container with all the contacts listed.
 */
function closeAssignedToField() {
  let listOfContactsToAssigne = document.getElementById(
    "task-contacts-list-to-assign"
  );
  if (listOfContactsToAssigne) {
    listOfContactsToAssigne.classList.add("d-none");
    document.getElementById("add-new-contact-bt").classList.add("d-none");
    document.getElementById("serchAssitUserValue").value = "";
  }
}

/**
 * This function stops closeAssignedToField() from closing when clicked on that particular element.
 *
 * @param {*} event
 */
function stopClosing(event) {
  event.stopPropagation();
}

/**
 * This function opens the subtext input by clicking on the subtask Button.
 */
function changeToSubText() {
  let subtaskButtonOpen = document.getElementById("task-sub-bt-open");
  subtaskButtonOpen.classList.add("d-none");
  let subtaskInputText = document.getElementById("task-sub-input-text-con");
  subtaskInputText.classList.remove("d-none");
}

/**
 * This function deletes the input value.
 */
function deleteInputText() {
  document.getElementById("task-sub-input-text").value = "";
}

/**
 * This function saves the input value as an object in newSubtask and than within the array subtasks.
 */
function saveInputText() {
  let subtaskInput = document.getElementById("task-sub-input-text");

  let newSubtask = {
    text: subtaskInput.value,
    completed: 0,
  };
  subtasks.push(newSubtask);
  subtaskInput.value = "";

  renderInputText();
}

/**
 * The new subtask within the subtasks array is generated under the subtask Button
 */
function renderInputText() {
  let subtaskTextCon = document.getElementById("task-sub-text");
  subtaskTextCon.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];
    subtaskTextCon.innerHTML += createInputText(i, subtask);
  }
}

/**
 * This function delets the subtask form the subtasks array and starts the
 * renderInputText() function again.
 *
 * @param {number} i This is the index of the subtask
 */
function deleteSubtask(i) {
  subtasks.splice(i, 1);
  renderInputText();
}

/**
 * This fuction opens a new input field with the value of the choosen subtask to be changed.
 *
 * @param {number} i This is the index of the subtask
 */
function editSubtask(i) {
  document.getElementById(`subtask-field-${i}`).classList.remove("d-none");
  document.getElementById(`subtask-li-${i}`).classList.add("d-none");
  let subtaskInputField = document.getElementById(`subtask-input-field-${i}`);
  subtaskInputField.value = subtasks[i]["text"];
}

/**
 * This function saves the changed input value and renders the subtasks again.
 *
 * @param {number} i This is the index of the subtask
 */

function saveEditedSubtask(i) {
  let subtaskInputField = document.getElementById(`subtask-input-field-${i}`);
  subtasks[i]["text"] = subtaskInputField.value;
  document.getElementById(`subtask-field-${i}`).classList.add("d-none");
  document.getElementById(`subtask-li-${i}`).classList.remove("d-none");
  renderInputText();
}

/**
 * This function determines today's date and returns it formatted
 *
 * @returns todayDate
 */
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

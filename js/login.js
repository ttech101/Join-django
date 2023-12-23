/**
 * Asynchronous function to log in a user.
 * It checks the provided email and password against the `users` array.
 * If a match is found, it saves the user's email and name to the LocalStorage and redirects to 'summary.html'.
 * Otherwise, it shows a popup with an error message.
 * @async
 */
async function login() {
  let emailLogin = document.getElementById("email").value;
  let passwordLogin = document.getElementById("password").value;
  await checkLoginUser(emailLogin, passwordLogin);
}

/**
 * Saves a user's email and name to LocalStorage.
 *
 * @param {string} u - The user's email.
 * @param {string} n - The user's name.
 */
function saveUserinLocalStorge(u, n) {
  user = JSON.stringify(u);
  user_name = JSON.stringify(n);
  localStorage.setItem("user", user);
  localStorage.setItem("name", user_name);
}

/**
 * Asynchronously checks the login credentials of a user and performs actions based on the server response.
 *
 * @function
 * @async
 * @param {string} email - The email address of the user for login.
 * @param {string} password - The password of the user for login.
 * @returns {Promise<void>} A promise that resolves after checking the login credentials and handling the server response.
 */
async function checkLoginUser(email, password) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    username: email,
    password: password,
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  fetch(STORAGE_URL + "login/", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if ("token" in result) {
        const authToken = result.token;
        contact = JSON.stringify(result.contact);
        task = JSON.stringify(result.task);
        long_name = result.name;
        sessionStorage.setItem("authToken", authToken);
        sessionStorage.setItem("contacts", contact);
        sessionStorage.setItem("tasks", task);
        sessionStorage.setItem("name", long_name);
        sessionStorage.setItem("email", email);
        window.location.href = "./html/summary.html";
        showPopup("Logged in successfully");
      } else {
        showPopup("Email and/or password are incorrect");
      }
    })
    .catch((error) => console.log("Server failed", error));
}

/**
 * Extracts the token parameter from the current URL's query parameters.
 *
 * @function
 * @returns {string | null} Returns the extracted token or null if the token parameter is not present in the URL.
 */
function extractTokenFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("token");
}

/**
 * Sends a password change request to the server with the provided new password.
 *
 * @function
 * @param {string} newPassword - The new password for the password change request.
 * @returns {void}
 * @throws {Error} Throws an error if the token is not found in the URL or if there is an error during the request.
 */
function sendPasswordChangeRequest(newPassword) {
  const token = extractTokenFromURL();
  if (!token) {
    console.error("Token not found in the URL");
    return;
  }
  const apiUrl = STORAGE_URL + "change_password/";
  const data = {
    token: token,
    password: newPassword,
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      // console.log(result);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

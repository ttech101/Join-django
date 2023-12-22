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
  // let user = users.find(u => u.email == emailLogin.value && u.password == passwordLogin.value);
  // if (user) {
  //     saveUserinLocalStorge(user.email,user.name);
  //     window.location.href = './html/summary.html';
  // } else {
  //     showPopup('Email and/or password are incorrect.');
  // }
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
        window.location.href = "./html/summary.html";
        showPopup("Logged in successfully");
      } else {
        showPopup("Email and/or password are incorrect");
      }
    })
    .catch((error) => console.log("Server failed", error));
}

// Funktion zum Extrahieren des Tokens aus der URL
function extractTokenFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("token");
}

// Funktion zum Senden der POST-Anfrage mit dem Token
function sendPasswordChangeRequest(newPassword) {
  const token = extractTokenFromURL();

  if (!token) {
    console.error("Token not found in the URL");
    return;
  }

  const apiUrl = STORAGE_URL + "change_password/";

  // Daten für die POST-Anfrage
  const data = {
    token: token,
    password: newPassword,
  };

  // Senden der POST-Anfrage mit Fetch
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      // Hier kannst du entsprechend auf die Antwort reagieren
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

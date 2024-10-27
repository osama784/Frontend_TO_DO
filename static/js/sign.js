// check if the user is signed up before.
let token = localStorage.getItem("token");
if (token) {
  GetUser();
} else {
  localStorage.removeItem("token");
}

let form = document.querySelector(".sign.container form");

let signButton = form.sign;
function checkInfo(username, password, email) {
  if (!username.value) {
    let usernameContainer = username.parentNode.parentNode;
    usernameContainer.classList.add("not-filled");
    username.value = "";
    username.placeholder = "please fill out this field";
    return;
  }

  if (!email.value) {
    let emailContainer = email.parentNode.parentNode;
    emailContainer.classList.add("not-filled");

    email.placeholder = "please fill out this field";
    return;
  }

  if (!email.value.endsWith("@gmail.com")) {
    let emailContainer = email.parentNode.parentNode;
    emailContainer.classList.add("not-filled");
    email.value = "";
    email.placeholder = "email should end with '@gmail.com'";
    return;
  }

  if (!password.value) {
    let passwordContainer = password.parentNode.parentNode;
    passwordContainer.classList.add("not-filled");
    password.placeholder = "please fill out this field";
    return;
  }
  if (password.value.length < 8) {
    let passwordContainer = password.parentNode.parentNode;
    passwordContainer.classList.add("not-filled");
    password.value = "";
    password.placeholder = "password should be at least 8 chars";
    return;
  }
  return true;
}

signButton.onclick = () => {
  let username = form.username;
  let password = form.password;
  let email = form.email;
  if (!checkInfo(username, password, email)) {
    return;
  }
  let status = SignUser(username, password, email);
  if (status == 201) {
    let succes = document.querySelector(".success");
    let theme = document.createElement("div");
    theme.classList.add("theme");
    succes.classList.add("success-shown");
    document.body.appendChild(theme);
  }
};

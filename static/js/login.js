// check if the user is logged in before

let token = localStorage.getItem("token");
if (token) {
  GetUser();
} else {
  localStorage.removeItem("token");
}

let form = document.querySelector(".login.container form");
let loginButton = form.login;
function checkInfo(username, password) {
  if (!username.value) {
    let usernameContainer = username.parentNode.parentNode;
    usernameContainer.classList.add("not-filled");
    username.value = "";
    username.placeholder = "please fill out this field";
    return;
  }

  if (!password.value) {
    let passwordContainer = password.parentNode.parentNode;
    passwordContainer.classList.add("not-filled");
    password.placeholder = "please fill out this field";
    return false;
  }
  if (password.value.length < 8) {
    let passwordContainer = password.parentNode.parentNode;
    passwordContainer.classList.add("not-filled");
    password.value = "";
    password.placeholder = "password should be at least 8 chars";
    return false;
  }
  return true;
}

loginButton.onclick = () => {
  let password = form.password;
  let username = form.username;
  if (!checkInfo(username, password)) {
    return;
  }
  LoginUser(username, password);
};

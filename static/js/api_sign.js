let SignUser = (username, password, email) => {
  let current_status;
  let information = {
    username: username.value,
    password: password.value,
    email: email.value,
  };
  fetch("https://osamaTasks.pythonanywhere.com/users/create/", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(information),
  })
    .then((response) => {
      current_status = response.status;
      if (current_status == 201) {
        let succes = document.querySelector(".success");
        let theme = document.createElement("div");
        theme.classList.add("theme");
        succes.classList.add("success-shown");
        document.body.appendChild(theme);
      }
      return response.json();
    })
    .then((data) => {
      if (data.errors) {
        let usernameContainer = username.parentNode.parentNode;
        usernameContainer.classList.add("not-filled");
        username.value = "";
        password.value = "";
        email.value = "";
        username.placeholder = data.errors;
        return;
      }
      let token = data.token;
      if (token) {
        localStorage.setItem("token", token);
      }
    });

  return current_status;
};

let GetUser = () => {
  fetch("https://osamaTasks.pythonanywhere.com/users/", {
    headers: {
      "Content-type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  }).then((response) => {
    current_status = response.status;
    if (current_status == 200) {
      window.location = "http://127.0.0.1:5500/index.html";
    } else if (current_status == 401) {
      localStorage.removeItem("token");
    }
    return response.json();
  });
};

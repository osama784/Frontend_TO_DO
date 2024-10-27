let LoginUser = (username, password) => {
  let information = {
    username: username.value,
    password: password.value,
  };
  fetch("http://127.0.0.1:8000/users/login/", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(information),
  })
    .then((response) => {
      current_status = response.status;
      console.log(current_status);
      if (current_status == 200) {
        let succes = document.querySelector(".success");
        let theme = document.createElement("div");
        theme.classList.add("theme");
        succes.classList.add("success-shown");
        document.body.appendChild(theme);
      } else if (current_status == 400) {
        let warn = form.querySelector("p");
        warn.classList.add("warn-shown");
      }
      return response.json();
    })
    .then((data) => {
      let token = data.token;
      if (token) {
        localStorage.setItem("token", token);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

let GetUser = () => {
  fetch("http://127.0.0.1:8000/users/", {
    headers: {
      "Content-type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      current_status = response.status;
      if (current_status == 200) {
        window.location = "http://127.0.0.1:5500/index.html";
      } else if (current_status == 401) {
        localStorage.removeItem("token");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

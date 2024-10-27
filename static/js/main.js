let header = document.querySelector("header");
let headerClass = "header-nav-shown-shadow";

let gear = document.querySelector(".settings i");
let login = document.querySelector(".log i");

let menu = document.querySelector(".menu");
let theme = document.createElement("div");
theme.classList.add("theme");
let nav = document.querySelector("nav");
let navClass = "nav-shown";

let classes = [gear, login, menu, theme];
let taskShownClass = "clicked-shown";
let allTasks;
let task_headers;
let current_task_id;
let current_category_id;
// let token = localStorage.getItem("token");

// add listener to the message.
let message = document.querySelector(".message");
let closingBtn = message.querySelector("span");
closingBtn.onclick = () => {
  message.classList.remove("message-shown");
};

// clicking on task choices
let taskChoices = document.querySelector(".tasks--wrapper .tasks-choices");

taskChoices.querySelectorAll("div").forEach((choice) => {
  choice.onclick = () => {
    sessionStorage.setItem("q_done", choice.dataset.done);
    taskChoices.querySelectorAll("div").forEach((choice) => {
      choice.classList.remove("selected-task-choice");
    });
    choice.classList.add("selected-task-choice");
    ShowTaskList();
  };
});

// check if there is q_done in the session storage
// check if there is q_category in the session storage
let is_done = sessionStorage.getItem("q_done");
if (is_done) {
  let task_choice = taskChoices.querySelector(
    `.tasks--wrapper .tasks-choices > div[data-done="${is_done}"]`
  );
  if (task_choice) {
    task_choice.classList.add("selected-task-choice");
  } else {
    task_choice = taskChoices.querySelector(
      `.tasks--wrapper .tasks-choices > div[data-done="All"]`
    );
    task_choice.classList.add("selected-task-choice");
  }
} else {
  taskChoices
    .querySelector(`.tasks--wrapper .tasks-choices > div[data-done="All"]`)
    .classList.add("selected-task-choice");
}

menu.addEventListener("click", () => {
  if (nav.classList.contains(navClass)) {
    menu.classList.remove("clicked-rotate");
    nav.classList.remove(navClass);
    header.classList.remove(headerClass);
    document.body.removeChild(theme);
  } else {
    if (
      deleteFormContainer.classList.contains(formClass) ||
      formContainer.classList.contains(formClass) ||
      categoryFormContainer.classList.contains(formClass) ||
      ChangeCategories.classList.contains(formClass) ||
      logout_form.classList.contains(formClass)
    ) {
      logout_form.classList.remove(formClass);
      formContainer.classList.remove(formClass);
      categoryFormContainer.classList.remove(formClass);
      ChangeCategories.classList.remove(formClass);
      deleteFormContainer.classList.remove(formClass);
    } else {
      document.body.appendChild(theme);
    }
    menu.classList.add("clicked-rotate");
    nav.classList.add(navClass);
    header.classList.add(headerClass);
  }
});

// Closing the nav if it is opened
window.addEventListener("resize", function () {
  if (window.innerWidth >= 992) {
    if (document.body.contains(theme)) {
      menu.classList.remove("clicked-rotate");
      nav.classList.remove(navClass);
      if (
        !formContainer.classList.contains(formClass) &
        !categoryFormContainer.classList.contains(formClass) &
        !ChangeCategories.classList.contains(formClass) &
        !deleteFormContainer.classList.contains(formClass) &
        !logout_form.classList.contains(formClass)
      ) {
        header.classList.remove(headerClass);
        document.body.removeChild(theme);
      }
    }
  }
});

// Show the task form (&&) Getting Information from the task form
let tasks_wrapper = document.querySelector(".tasks--wrapper .container .tasks");
let taskForm = document.querySelector(".form-container form");
let formContainer = document.querySelector(".form-container");
let addButton = taskForm.add;
addButton.onclick = (e) => {
  e.preventDefault();
  formContainer.classList.remove(formClass);
  document.body.removeChild(theme);
  header.classList.remove(headerClass);
  if (!taskForm.task_name.value.length || !taskForm.description.value.length) {
    let message = document.querySelector(".message");
    message.querySelector("p").innerHTML = "Please fill out the fields.";
    message.classList.add("message-shown");
    return;
  }
  if (current_task_id) {
    UpdateTask(taskForm.task_name, taskForm.description, taskForm.category);
  } else {
    CreateTask(taskForm.task_name, taskForm.description, taskForm.category);
  }

  let message = document.querySelector(".message");
  message.querySelector("p").innerHTML = "Task Added Successfully!";
  message.classList.add("message-shown");

  //Readding the scroll
  window.onscroll = null;
};

// Show Task form (&&) Closing it
let plusButton = document.querySelector(".tasks--wrapper .tasks-header .icon");
let formClass = "form-shown";
plusButton.onclick = () => {
  document.body.appendChild(theme);
  header.classList.add(headerClass);
  formContainer.classList.add(formClass);

  taskForm.task_name.value = "";
  taskForm.description.value = "";
  taskForm.category.value = "-1";
  current_task_id = "";

  let message = document.querySelector(".message");
  message.classList.remove("message-shown");

  let confirmButton = document.querySelector(
    ".form-container form .confirm input"
  );
  confirmButton.value = "Add";
  const x = window.scrollX;
  const y = window.scrollY;
  window.onscroll = () => {
    window.scrollTo(x, y);
  };
};

let closeButton = document.querySelector(".form-container .close");

closeButton.onclick = () => {
  formContainer.classList.remove(formClass);
  document.body.removeChild(theme);
  header.classList.remove(headerClass);
  //Readding the scroll
  window.onscroll = null;
};

// Clicking on categories:

let categories = document.querySelectorAll(".all .categories li");
let CategoryContainer = document.querySelector(".all .categories");

plusButton = document.querySelector(".all nav .categories .add-category");
let categoryFormContainer = document.querySelector(".category-form");
let categoryForm = document.querySelector(".category-form form");
plusButton.onclick = () => {
  categoryForm.category_name.value = "";
  let message = document.querySelector(".message");
  message.classList.remove("message-shown");

  categoryFormContainer.classList.add(formClass);
  if (!menu.classList.contains("clicked-roate")) {
    document.body.appendChild(theme);
    header.classList.add(headerClass);
  }

  menu.classList.remove("clicked-rotate");
  nav.classList.remove(navClass);

  //Stopping the scroll
  const x = window.scrollX;
  const y = window.scrollY;
  window.onscroll = () => {
    window.scrollTo(x, y);
  };
};

closeButton = document.querySelector(".category-form .close");

closeButton.onclick = () => {
  categoryFormContainer.classList.remove(formClass);
  document.body.removeChild(theme);
  header.classList.remove(headerClass);

  //Readding the scroll
  window.onscroll = null;
};
addButton = categoryForm.add;

addButton.onclick = (e) => {
  e.preventDefault();

  document.body.removeChild(theme);
  header.classList.remove(headerClass);
  categoryFormContainer.classList.remove(formClass);
  if (!categoryForm.name.value) {
    let message = document.querySelector(".message");
    message.querySelector("p").innerHTML = "Please fill out the fields.";
    message.classList.add("message-shown");
    return;
  }

  CreateCategory();

  categoryForm.name.innerHTML = "";
  let message = document.querySelector(".message");
  message.querySelector("p").innerHTML = "Category Added Successfully!";
  message.classList.add("message-shown");

  //Readding the scroll
  window.onscroll = null;
};

let deleteFormContainer = document.querySelector(".delete-form");
let deleteForm = document.querySelector(".delete-form form");
closeButton = document.querySelector(".delete-form .close");

closeButton.onclick = () => {
  deleteFormContainer.classList.remove(formClass);
  document.body.removeChild(theme);
  header.classList.remove(headerClass);

  //Readding the scroll
  window.onscroll = null;
};
let deleteButton = deleteForm.delete;

deleteButton.onclick = (e) => {
  e.preventDefault();

  deleteFormContainer.classList.remove(formClass);
  document.body.removeChild(theme);
  header.classList.remove(headerClass);

  DeleteTask();
  // minus one for the tasks number
  let tasks_number = document.querySelector(".tasks--wrapper .tasks-number");
  let old_tasks_number = tasks_number.querySelector("span").innerHTML;
  tasks_number.querySelector("span").textContent = Number(old_tasks_number) - 1;

  // minus one for the all categories button
  let all_categories_button = document.querySelector(
    ".all nav .categories ul li.all-categories"
  );
  let oldValue = all_categories_button.querySelector("span").innerHTML.slice(1);
  all_categories_button.querySelector("span").innerHTML = `(${
    parseInt(oldValue) - 1
  })`;

  // minus one for the category if is there
  if (current_category_id) {
    {
      let categoryTaskNumber = document.querySelector(
        `.all nav .categories ul li[data-id="${current_category_id}"] span`
      );
      let oldNumber = categoryTaskNumber.innerHTML.slice(1);
      categoryTaskNumber.innerHTML = `(${parseInt(oldNumber) - 1})`;
    }
  }

  let message = document.querySelector(".message");
  message.querySelector("p").innerHTML = "Task Deleted Successfully!";
  message.classList.add("message-shown");

  //Readding the scroll
  window.onscroll = null;

  if (old_tasks_number == "1") {
    let defaultContent = "<p>No tasks.</p>";
    tasks_wrapper.innerHTML = defaultContent;
    tasks_number.querySelector("p").innerHTML = "<span>0</span> Task";
    return;
  } else if (old_tasks_number == "2") {
    tasks_number.querySelector("p").innerHTML = `<span>1</span> Task`;
  }
  tasks_wrapper.removeChild(
    tasks_wrapper.querySelector(`.task-details[data-id="${current_task_id}"]`)
  );
};

let cancelButton = deleteForm.cancel;

cancelButton.addEventListener("click", (e) => {
  e.preventDefault();

  document.body.removeChild(theme);
  header.classList.remove(headerClass);
  deleteFormContainer.classList.remove(formClass);

  //Readding the scroll
  window.onscroll = null;
});

// Change categories:
let ChangeCategories = document.querySelector(".change-categories");
closeButton = ChangeCategories.querySelector(".close");

closeButton.onclick = () => {
  ChangeCategories.classList.remove(formClass);
  document.body.removeChild(theme);
  header.classList.remove(headerClass);

  //Readding the scroll
  window.onscroll = null;
};

//clicking on change categories button

let ChangeCategoriesButton = document.querySelector(
  ".all nav .categories .change-categories-button"
);
ChangeCategoriesButton.onclick = () => {
  let message = document.querySelector(".message");
  message.classList.remove("message-shown");
  if (!menu.classList.contains("clicked-rotate")) {
    document.body.appendChild(theme);
  }
  menu.classList.remove("clicked-rotate");
  nav.classList.remove(navClass);
  header.classList.add(headerClass);

  let ChangeCategoryContainer = document.querySelector(".change-categories");
  ChangeCategoryContainer.classList.add(formClass);

  const x = window.scrollX;
  const y = window.scrollY;
  window.onscroll = () => {
    window.scrollTo(x, y);
  };
};

// logout user

let log_button = document.querySelector("header .log ");
let logout_form = document.querySelector(".logout-form");

log_button.addEventListener("click", (e) => {
  console.log(e.target)
  if (log_button.title == "logout") {
    logout_form.classList.add(formClass);
    document.body.appendChild(theme);

    const x = window.scrollX;
    const y = window.scrollY;
    window.onscroll = () => {
      window.scrollTo(x, y);
    };
  } else {
    window.location = "login.html";
  }
});

closeButton = logout_form.querySelector(".close");

closeButton.onclick = () => {
  logout_form.classList.remove(formClass);
  document.body.removeChild(theme);
  header.classList.remove(headerClass);

  //Readding the scroll
  window.onscroll = null;
};

cancelButton = logout_form.querySelector(".cancel");

cancelButton.addEventListener("click", (e) => {
  e.preventDefault();

  document.body.removeChild(theme);
  header.classList.remove(headerClass);
  logout_form.classList.remove(formClass);

  //Readding the scroll
  window.onscroll = null;
});

let confirmButton = logout_form.querySelector(".logout");

confirmButton.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  location.reload();
});

document.addEventListener("click", (event) => {
  allTasks = document.querySelectorAll(".task-details");
  if (!loaded) {
    loaded = true;
    AddingTaskListiners();
    AddingCategoriesListeners();
  }

  // Adding events for square checks:
  if (event.target.classList.contains("fa-square-check")) {
    let check = event.target;
    let task = check.parentElement.parentElement.parentElement;
    current_task_id = task.dataset.id;
    let taskH2 = task.querySelector(".task-header h2");
    let task_description = task.querySelector(".task-description");
    if (check.classList.contains("fa-regular")) {
      check.className = "fa-solid fa-square-check";
      taskH2.classList.add("task-done");
      task_description.classList.add("task-done");
      DoTask(true);
    } else {
      check.className = "fa-regular fa-square-check";
      taskH2.classList.remove("task-done");
      task_description.classList.remove("task-done");
      DoTask(false);
    }
  }

  if (!event.target.classList.contains("task-menu")) {
    // Closing all tabs of task_settings if mouse clicked on screen
    allTasks.forEach((task) => {
      let task_settings = task.querySelector(".task-settings");
      if (task_settings.classList.contains(taskShownClass)) {
        task_settings.classList.remove(taskShownClass);
      }
    });
  }
  if (event.target.classList.contains("task-menu")) {
    // Closing other tabs of task_settings when one is shown
    let all_menus = document.querySelectorAll(
      ".task-details .task-header .icons .task-menu"
    );
    let current_task_menu = event.target;
    let current_task_settings =
      event.target.parentElement.parentElement.querySelector(".task-settings");
    all_menus.forEach((task_menu) => {
      let task_settings =
        task_menu.parentElement.parentElement.querySelector(".task-settings");
      if (task_settings.classList.contains(taskShownClass)) {
        if (current_task_menu != task_menu) {
          task_settings.classList.remove(taskShownClass);
        }
      }
    });
    if (current_task_settings.classList.contains(taskShownClass)) {
      current_task_settings.classList.remove(taskShownClass);
    } else {
      current_task_settings.classList.add(taskShownClass);
    }
  }

  // Closing nav (&&) Closing Task form
  if (classes.includes(event.target)) {
    if (nav.classList.contains(navClass) && event.target != menu) {
      nav.classList.remove(navClass);
      header.classList.remove(headerClass);
      menu.classList.remove("clicked-rotate");
      document.body.removeChild(theme);
      window.onscroll = null;
    }
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
      document.body.removeChild(theme);
      window.onscroll = null;
    }
  }
  let deleteConfirmClass = "clicked-delete";
  if (event.target.classList.contains("fa-trash-can")) {
    let deleteConfirm =
      event.target.parentElement.parentElement.querySelector(".confirm-delete");

    if (deleteConfirm.classList.contains(deleteConfirmClass)) {
      deleteConfirm.classList.remove(deleteConfirmClass);
    } else {
      deleteConfirm.classList.add(deleteConfirmClass);
    }
  } else {
    let deleteConfirmAll = document.querySelectorAll(".confirm-delete");
    deleteConfirmAll.forEach((deleteConfirm) => {
      deleteConfirm.classList.remove(deleteConfirmClass);
    });
  }

  if (event.target.matches(".all nav .categories ul li")) {
    sessionStorage.setItem("q_category", event.target.dataset.id);
    let categoryChoices = document.querySelector(".all nav .categories ul");
    categoryChoices.querySelectorAll("li").forEach((category) => {
      category.classList.remove("selected-category-choice");
    });
    event.target.classList.add("selected-category-choice");
    if (menu.classList.contains("clicked-rotate")) {
      menu.classList.remove("clicked-rotate");
      nav.classList.remove(navClass);
      document.body.removeChild(theme);
    }
    ShowTaskList();
  }
});

// to track the events everytime the api being fetched.
let loaded = false;
let q_category;
let q_done;

let ShowTaskList = () => {
  let current_status;
  q_category = sessionStorage.getItem("q_category");
  q_done = sessionStorage.getItem("q_done");
  tasks_wrapper.innerHTML = "";
  // to reAdd the listeners

  endpoint = `http://127.0.0.1:8000/tasks/?q_category=${q_category}&q_done=${q_done}`;
  fetch(endpoint, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.status == 401) {
        // not authorized
        current_status = 401;
        let defaultContent =
          "<p>if you want to see your tasks, please log in first!</p>";
        tasks_wrapper.innerHTML = defaultContent;
        let categories = document.querySelector(".all nav .categories");
        categories.removeChild(categories.querySelector(".add-category"));

        categories.removeChild(
          categories.querySelector(".change-categories-button")
        );
        categories
          .querySelector("ul")
          .removeChild(categories.querySelector("li.all-categories"));
        let tasks_header = document.querySelector(
          ".tasks--wrapper .tasks-header"
        );
        categories.textContent = "No Categories";

        tasks_header.removeChild(tasks_header.querySelector(".icon"));
      }
      return response.json();
    })
    .then((data) => {
      if (current_status == 401) {
        return;
      }
      let loginIcon = document.querySelector("header .log");
      loginIcon.title = "logout";

      let userWelcome = document.querySelector("header .container h2 span");
      userWelcome.innerHTML = data.owner.toLowerCase();
      let task_number = document.querySelector(
        ".tasks--wrapper .tasks-number p"
      );
      if (!data.tasks.length) {
        task_number.innerHTML = `<span>0</span> Task`;
        if (q_done == "True") {
          let defaultContent =
            "<p>You don't have any completed task, go and got'em!</p>";
          tasks_wrapper.innerHTML = defaultContent;
          task_number.querySelector("span").innerHTML = data.tasks.length;
          return;
        } else {
          let defaultContent =
            "<p>You haven't created tasks yet, let's create one!</p>";
          tasks_wrapper.innerHTML = defaultContent;
          task_number.querySelector("span").innerHTML = data.tasks.length;
          return;
        }
      }

      task_number.innerHTML = `<span>${data.tasks.length}</span> Tasks`;
      if (data.tasks.length == 1) {
        task_number.innerHTML = `<span>${data.tasks.length}</span> Task`;
      }

      data.tasks.forEach((task) => {
        let newTask;
        let is_done;
        if (task.is_done) {
          is_done = `
          <div class="task-header">
            <h2 class="task-done">${task.name}</h2>
            <div class="icons">
              <i class="fa-solid fa-ellipsis task-menu"></i>
              <i class="fa-solid fa-square-check"></i>
            </div>
            <div class="task-settings">
              <p class="edit-task">Edit</p>
              <p class="delete-task">Delete</p>
            </div>
          </div>
              
              <p class="task-description task-done">
                  ${task.body}
              </p>
          `;
        } else {
          is_done = `
            <div class="task-header">
              <h2>${task.name}</h2>
              <div class="icons">
                <i class="fa-solid fa-ellipsis task-menu"></i>
                <i class="fa-regular fa-square-check"></i>
              </div>
              <div class="task-settings">
                <p class="edit-task">Edit</p>
                <p class="delete-task">Delete</p>
              </div>
            </div>
              
              <p class="task-description">
                  ${task.body}
              </p>
          `;
        }
        if (task.category) {
          newTask = `
            <div class="task-details" data-id="${task.id}">
                  ${is_done}
              <small data-id="${task.category.id}">${task.category.name}</small>
            </div>
        
          `;
        } else {
          newTask = `
              <div class="task-details" data-id="${task.id}">
                    ${is_done}
                </div>
            `;
        }
        tasks_wrapper.innerHTML += newTask;
      });
      loaded = false;
    });
};

let AddingTaskListiners = () => {
  let tasks = document.querySelectorAll(".tasks--wrapper .tasks .task-details");
  tasks.forEach((task) => {
    let task_settings = task.querySelector(".task-settings");

    // Showing form of task editing
    let taskEdit = task_settings.querySelector(".edit-task");
    taskEdit.addEventListener("click", () => {
      menu.classList.remove("clicked-rotate");
      nav.classList.remove(navClass);
      header.classList.add(headerClass);
      current_task_id = task.dataset.id;
      let message = document.querySelector(".message");
      message.classList.remove("message-shown");
      message.querySelector("p").innerHTML = "Task Updated Successfully!";

      // filling the form with old values
      let oldValueName = task.querySelector(".task-header h2").innerText;
      let oldValueDesc = task.querySelector(".task-description");

      formContainer.querySelector(".task_name input").value = oldValueName;
      formContainer.querySelector(".description textarea").innerText =
        oldValueDesc.innerText;

      if (task.querySelector("small")) {
        let oldValueCateg = task.querySelector("small").dataset.id;
        formContainer
          .querySelector(`.category select option[value="${oldValueCateg}"]`)
          .setAttribute("selected", true);
      }

      // Showing the form
      formContainer.classList.add(formClass);
      document.body.appendChild(theme);

      let confirmButton = document.querySelector(
        ".form-container form .confirm input"
      );
      confirmButton.value = "Update";

      //Stopping the scroll
      const x = window.scrollX;
      const y = window.scrollY;
      window.onscroll = () => {
        window.scrollTo(x, y);
      };
    });

    // Showing form of task deleting
    let taskDelete = task_settings.querySelector(".delete-task");
    taskDelete.addEventListener("click", () => {
      menu.classList.remove("clicked-rotate");
      nav.classList.remove(navClass);
      header.classList.add(headerClass);

      current_task_id = task.dataset.id;
      if (task.querySelector("small")) {
        current_category_id = task.querySelector("small").dataset.id;
      } else {
        current_category_id = "";
      }
      let message = document.querySelector(".message");
      message.classList.remove("message-shown");

      deleteFormContainer.classList.add(formClass);
      document.body.appendChild(theme);

      //Stopping the scroll
      const x = window.scrollX;
      const y = window.scrollY;
      window.onscroll = () => {
        window.scrollTo(x, y);
      };
    });
  });
};

let AddingCategoriesListeners = () => {
  let CategoryList = document.querySelector(".all nav .categories ul");
  let ChangeCategories = document.querySelectorAll(".change-categories ul li");
  ChangeCategories.forEach((category) => {
    let checkMark = category.querySelector(".confirm-delete .fa-check");
    let deleteConfirm = category.querySelector(".confirm-delete");
    let deleteConfirmClass = "clicked-delete";

    let trashCan = category.querySelector(".icons .fa-trash-can");
    trashCan.onclick = () => {
      current_category_id = category.dataset.id;
      // deleteConfirm.classList.add(deleteConfirmClass);
      checkMark.onclick = () => {
        DeleteCategory();
        category.parentElement.removeChild(category);
        let removedCategory = CategoryList.querySelector(
          `li[data-id="${category.dataset.id}"]`
        );
        CategoryList.removeChild(removedCategory);
      };
    };

    let renameCircle = category.querySelector(".icons .fa-arrow-rotate-left");
    let renameConfirmClass = "clicked-rename";
    renameCircle.onclick = () => {
      current_category_id = category.dataset.id;
      let replaced = false;
      let oldElement = category.querySelector(".category_name");
      let newElement = document.createElement("input");

      oldElement.replaceWith(newElement);
      newElement.focus();
      newElement.setAttribute("value", oldElement.innerHTML);
      newElement.setAttribute("name", oldElement.innerHTML.toLowerCase());
      deleteConfirm.classList.add(renameConfirmClass);
      checkMark.addEventListener("mousedown", () => {
        let newValue = newElement.value;
        if (!newValue) {
          newElement.value = oldElement.innerHTML;
          return;
        }
        UpdateCategory(newValue);
        replaced = true;
        oldElement.innerHTML = newValue;
        newElement.replaceWith(oldElement);
        deleteConfirm.classList.remove(renameConfirmClass);
      });
      newElement.onblur = () => {
        if (!replaced) {
          newElement.replaceWith(oldElement);
          deleteConfirm.classList.remove(renameConfirmClass);
        }
      };
    };
  });
};

let CreateTask = (name, description, category) => {
  let information;
  if (category.value == -1) {
    information = {
      name: name.value,
      body: description.value,
    };
  } else {
    information = {
      name: name.value,
      body: description.value,
      category: category.value,
    };
  }

  fetch("http://127.0.0.1:8000/tasks/create/", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(information),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.detail) {
        return;
      }
      let newTask;

      if (data.is_done) {
        is_done = `
        <h2 class="task-done">${data.name}</h2>
          <div class="icons">
            <i class="fa-solid fa-ellipsis task-menu"></i>
            <i class="fa-solid fa-square-check"></i>
          </div>
        `;
      } else {
        is_done = `
        <h2>${data.name}</h2>
          <div class="icons">
            <i class="fa-solid fa-ellipsis task-menu"></i>
            <i class="fa-regular fa-square-check"></i>
          </div>
        `;
      }
      if (data.category) {
        newTask = `
    <div class="task-details" data-id="${data.id}">
      <div class="task-header">
          <h2>${data.name}</h2>
          <div class="icons">
            <i class="fa-solid fa-ellipsis task-menu"></i>
            <i class="fa-regular fa-square-check"></i>
          </div>

          <div class="task-settings">
              <p class="edit-task">Edit</p>
              <p class="delete-task">Delete</p>
          </div>
      </div>
      
      <p class="task-description">
          ${data.body}
      </p>
      <small data-id="${data.category.id}">${data.category.name}</small>
      </div>
        
  `;
      } else {
        newTask = `
    <div class="task-details" data-id="${data.id}">
      <div class="task-header">
          <h2>${data.name}</h2>
          <div class="icons">
            <i class="fa-solid fa-ellipsis task-menu"></i>
            <i class="fa-regular fa-square-check"></i>
          </div>

          <div class="task-settings">
              <p class="edit-task">Edit</p>
              <p class="delete-task">Delete</p>
          </div>
      </div>
      
      <p class="task-description">
          ${data.body}
      </p>
      </div>
  `;
      }
      // do not add the task if the q_category does not match the current one.
      let is_good_category = document.querySelector(
        `.all nav .categories ul li[data-id="${q_category}"]`
      );
      let could_add_task = false;

      if (data.category) {
        // plus one for the category
        let category = document.querySelector(
          `.all nav .categories ul li[data-id="${data.category.id}"]`
        );
        let categoryTaskNumber = category.querySelector("span");
        let oldNumber = categoryTaskNumber.innerHTML.slice(1);
        categoryTaskNumber.innerHTML = `(${parseInt(oldNumber) + 1})`;

        if (
          (data.category.id == q_category || !is_good_category) &&
          q_done != "True"
        ) {
          could_add_task = true;
        }
      } else if (!is_good_category && q_done != "True") {
        could_add_task = true;
      }

      if (could_add_task) {
        if (!document.querySelector(".tasks--wrapper .task-details")) {
          tasks_wrapper.innerHTML = "";
        }
        tasks_wrapper.innerHTML += newTask;

        // plus one for the tasks number in tasks wrapper
        let tasks_number = document.querySelector(
          ".tasks--wrapper .tasks-number"
        );
        let old_tasks_number = tasks_number.querySelector("span").innerHTML;
        tasks_number.querySelector("p").innerHTML = `<span>${
          Number(old_tasks_number) + 1
        }</span> Tasks`;

        if (old_tasks_number == 0) {
          tasks_number.querySelector("p").innerHTML = `<span>1</span> Task`;
        }
        // readding the listeners to the tasks.
        AddingTaskListiners();
      }

      // plus one for the all categories button
      let all_categories_button = document.querySelector(
        ".all nav .categories ul li.all-categories"
      );
      let oldTasksNumber = all_categories_button
        .querySelector("span")
        .innerHTML.slice(1);
      all_categories_button.querySelector("span").innerHTML = `(${
        parseInt(oldTasksNumber) + 1
      })`;
    });
};

let UpdateTask = (name, description, category) => {
  let information;
  if (category.value != -1) {
    information = {
      name: name.value,
      body: description.value,
      category: category.value,
    };
  } else {
    information = {
      name: name.value,
      body: description.value,
      category: null,
    };
  }
  fetch(`http://127.0.0.1:8000/tasks/${current_task_id}/update/`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(information),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.detail) {
        return;
      }
      let currentTask = document.querySelector(
        `.tasks--wrapper .container .task-details[data-id="${data.id}"]`
      );
      currentTask.querySelector(".task-header h2").innerHTML = data.name;
      currentTask.querySelector(".task-description").innerHTML = data.body;
      let oldCategory = currentTask.querySelector("small");
      let categoryTaskNumber;
      let oldNumber;
      let newCategory;
      if (data.category) {
        newCategory = document.querySelector(
          `.all nav .categories ul li[data-id="${data.category.id}"]`
        );
      }
      if (data.category) {
        if (oldCategory) {
          if (oldCategory.dataset.id != data.category.id) {
            // minus one for old category
            let currentCategory = document.querySelector(
              `.all nav .categories ul li[data-id="${oldCategory.dataset.id}"]`
            );

            categoryTaskNumber = currentCategory.querySelector("span");
            oldNumber = categoryTaskNumber.innerHTML.slice(1);
            categoryTaskNumber.innerHTML = `(${parseInt(oldNumber) - 1})`;

            if (q_category == oldCategory.dataset.id) {
              let tasks_wrapper = document.querySelector(
                ".tasks--wrapper .tasks"
              );
              tasks_wrapper.removeChild(currentTask);
              let tasks_number = document.querySelector(
                ".tasks--wrapper .tasks-number"
              );
              let old_tasks_number =
                tasks_number.querySelector("span").innerHTML;
              tasks_number.querySelector("span").textContent =
                Number(old_tasks_number) - 1;
            }

            // plus one for new Category

            categoryTaskNumber = newCategory.querySelector("span");
            oldNumber = categoryTaskNumber.innerHTML.slice(1);
            categoryTaskNumber.innerHTML = `(${parseInt(oldNumber) + 1})`;

            // Change the category inside the task
            oldCategory.innerHTML =
              newCategory.querySelector(".category_name").innerHTML;
          }
        } else {
          let small = `<small>${data.category.name}</small>`;
          currentTask.innerHTML += small;

          categoryTaskNumber = newCategory.querySelector("span");
          oldNumber = categoryTaskNumber.innerHTML.slice(1);
          categoryTaskNumber.innerHTML = `(${parseInt(oldNumber) + 1})`;
        }
      } else {
        if (oldCategory) {
          // minus one for old category
          let currentCategory = document.querySelector(
            `.all nav .categories ul li[data-id="${oldCategory.dataset.id}"]`
          );

          categoryTaskNumber = currentCategory.querySelector("span");
          oldNumber = categoryTaskNumber.innerHTML.slice(1);
          categoryTaskNumber.innerHTML = `(${parseInt(oldNumber) - 1})`;

          // removing small element that contains category
          currentTask.removeChild(oldCategory);
        }
      }
    });
};

let DeleteTask = () => {
  let current_status;
  fetch(`http://127.0.0.1:8000/tasks/${current_task_id}/delete/`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.status == 401) {
        current_status = 401;
      }
      // return response.json();
    })
    .then((data) => {
      if (current_status == 401) {
        return;
      }
    });
};

let DoTask = (done) => {
  let information = {
    is_done: done,
  };
  fetch(`http://127.0.0.1:8000/tasks/${current_task_id}/update/`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(information),
  })
    .then((response) => response.json())
    .then((data) => {});
};

let ShowCategoryList = () => {
  fetch("http://127.0.0.1:8000/tasks/categories/", {
    headers: {
      "Content-type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.detail) {
        return;
      }
      let CategoryList = document.querySelector(".all nav .categories ul");

      // put the actual number of tasks
      let all_categories_button =
        CategoryList.querySelector("li.all-categories");

      all_categories_button.querySelector(
        "span"
      ).innerHTML = `(${data.tasks_number})`;

      let CategoryOptions = document.querySelector(
        ".form-container form .category select"
      );
      let ChangeCategories = document.querySelector(".change-categories ul");

      data.categories.forEach((category) => {
        // add the category to the nav
        let newCateg = `<li data-id="${category.id}"><div class="category_name">${category.name}</div><span>(${category.task_number})</span></li>`;
        CategoryList.innerHTML += newCateg;

        //add the category to the options of the task form
        let newOption = `<option value="${category.id}">${category.name}</option>`;
        CategoryOptions.innerHTML += newOption;

        //add the category to the change categories form
        let newChangeCategory = `
          <li data-id="${category.id}">
            <div class="category_name">${category.name}</div>
            <div class="icons">
                <i class="fa-solid fa-arrow-rotate-left"></i>
                <i class="fa-solid fa-trash-can"></i>
            </div>
            <div class="confirm-delete">
                <i class="fa-solid fa-check"></i>
                <i class="fa-solid fa-xmark"></i>
            </div>
          </li>
        `;
        ChangeCategories.innerHTML += newChangeCategory;
      });
      let q_category = sessionStorage.getItem("q_category");
      let categoryChoices = document.querySelector(".all nav .categories ul");
      all_categories_button = CategoryList.querySelector("li.all-categories");
      categoryChoices.querySelectorAll("li").forEach((current_category) => {
        current_category.classList.remove("selected-category-choice");
      });
      if (q_category) {
        let category = categoryChoices.querySelector(
          `li[data-id="${q_category}"]`
        );
        if (category) {
          category.classList.add("selected-category-choice");
        } else {
          all_categories_button.classList.add("selected-category-choice");
        }
      } else {
        all_categories_button.classList.add("selected-category-choice");
      }
    });
};

ShowTaskList();
ShowCategoryList();

let CreateCategory = () => {
  let information = {
    name: categoryForm.name.value,
  };
  fetch(`http://127.0.0.1:8000/tasks/categories/create/`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(information),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let CategoryList = document.querySelector(".all nav .categories ul");
      let CategoryOptions = document.querySelector(
        ".form-container form .category select"
      );
      let ChangeCategories = document.querySelector(".change-categories ul");

      // add the category to the nav
      let newCategory = `
      <li data-id="${data.id}"><div class="category_name">${data.name}</div> <span>(${data.task_number})</span></li>
      `;
      CategoryList.innerHTML += newCategory;

      //add the category to the options of the task form
      let newOption = `<option value="${data.id}">${data.name}</option>`;
      CategoryOptions.innerHTML += newOption;

      //add the category to the change categories form
      let newChangeCategory = `
          <li data-id="${data.id}">
            <div class="category_name">${data.name}</div>
            <div class="icons">
                <i class="fa-solid fa-arrow-rotate-left"></i>
                <i class="fa-solid fa-trash-can"></i>
            </div>
            <div class="confirm-delete">
                <i class="fa-solid fa-check"></i>
                <i class="fa-solid fa-xmark"></i>
            </div>
          </li>
        `;
      ChangeCategories.innerHTML += newChangeCategory;

      //Adding listeners to the change category:
      newChangeCategory = ChangeCategories.querySelector(
        `li[data-id="${data.id}"]`
      );
      let checkMark = newChangeCategory.querySelector(
        ".confirm-delete .fa-check"
      );
      let deleteConfirm = newChangeCategory.querySelector(".confirm-delete");
      let deleteConfirmClass = "clicked-delete";

      let trashCan = newChangeCategory.querySelector(".icons .fa-trash-can");
      trashCan.onclick = () => {
        current_category_id = data.id;
        // deleteConfirm.classList.add(deleteConfirmClass);
        checkMark.onclick = () => {
          DeleteCategory();
          newChangeCategory.parentElement.removeChild(newChangeCategory);
          let removedCategory = CategoryList.querySelector(
            `li[data-id="${data.id}"]`
          );
          CategoryList.removeChild(removedCategory);
        };
      };

      let renameCircle = newChangeCategory.querySelector(
        ".icons .fa-arrow-rotate-left"
      );
      let renameConfirmClass = "clicked-rename";
      renameCircle.onclick = () => {
        current_category_id = data.id;
        let replaced = false;
        let oldElement = newChangeCategory.querySelector(".category_name");
        let newElement = document.createElement("input");

        oldElement.replaceWith(newElement);
        newElement.focus();
        newElement.setAttribute("value", oldElement.innerHTML);
        newElement.setAttribute("name", oldElement.innerHTML.toLowerCase());
        deleteConfirm.classList.add(renameConfirmClass);
        checkMark.addEventListener("mousedown", () => {
          let newValue = newElement.value;
          if (!newValue) {
            newElement.value = oldElement.innerHTML;
            return;
          }
          UpdateCategory();
          replaced = true;
          oldElement.innerHTML = newValue;
          newElement.replaceWith(oldElement);
          deleteConfirm.classList.remove(renameConfirmClass);
        });
        newElement.onblur = () => {
          if (!replaced) {
            newElement.replaceWith(oldElement);
            deleteConfirm.classList.remove(renameConfirmClass);
          }
        };
      };

      // Adding features to category in the nav

      newCategory = CategoryList.querySelector(`li[data-id="${data.id}"]`);
    });
};

let DeleteCategory = () => {
  fetch(
    `http://127.0.0.1:8000/tasks/categories/${current_category_id}/delete/`,
    {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }
  )
    .then((response) => {})
    .then((data) => {
      allTasks = document.querySelectorAll(".task-details");
      allTasks.forEach((task) => {
        let category = task.querySelector("small");
        if (category) {
          if (category.dataset.id == current_category_id) {
            task.removeChild(category);
          }
        }
      });
    });
};

let UpdateCategory = (categoryName) => {
  let information = {
    name: categoryName,
  };
  fetch(
    `http://127.0.0.1:8000/tasks/categories/${current_category_id}/update/`,
    {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(information),
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let oldCategory = document.querySelector(
        `.all nav .categories ul li[data-id="${data.id}"] .category_name`
      );
      oldCategory.innerHTML = data.name;
      allTasks = document.querySelectorAll(".task-details");
      allTasks.forEach((task) => {
        let category = task.querySelector("small");
        if (category) {
          if ((category.dataset.id = data.id)) {
            category.innerHTML = data.name;
          }
        }
      });
    });
};

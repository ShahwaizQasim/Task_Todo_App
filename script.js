let currentTab = "personal";

// Load from localStorage
const savedTasks = JSON.parse(localStorage.getItem("tasks"));

const tasks = savedTasks || {
  personal: [],
  professional: [],
};

// Input values store karne ke liye
const inputValues = {
  personal: "",
  professional: "",
};

const tabs = document.querySelectorAll(".tab");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const tabButtons = document.querySelectorAll(".tab-btn");

// Tabs Switch Functionality
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentTab = tab.getAttribute("data-tab");

    let column = document.querySelectorAll(".col-6");
    column.forEach((col) => {
      col.classList.remove("tab-active");
    });

    let columnsHeading = document.querySelectorAll(".tab");
    columnsHeading.forEach((t) => {
      t.classList.remove("active");
    });

    tab.parentElement.classList.add("tab-active");
    tab.classList.add("active");

    taskInput.value = inputValues[currentTab];

    renderTasks();
  });
});

taskInput.addEventListener("input", () => {
  inputValues[currentTab] = taskInput.value;
});

/* Switch Tabs */
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentTab = btn.dataset.tab;

    ```
tabButtons.forEach(b => b.classList.remove("active-tab"));
btn.classList.add("active-tab");

renderTasks();
```;
  });
});

/* Add Task */
addBtn.addEventListener("click", () => {
  if (taskInput.value.trim() === "") return;

  tasks[currentTab].push({
    text: taskInput.value,
    completed: false,
  });

  // Save to localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskInput.value = "";
  inputValues[currentTab] = "";

  renderTasks();
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addBtn.click();
  }
});

/* Toggle Task */
function toggleTask(index) {
  tasks[currentTab][index].completed = !tasks[currentTab][index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

/* Delete Task */
function deleteTask(index) {
  index = Number(index); // string to number conversion
  tasks[currentTab].splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

/* Clear Completed */
clearBtn.addEventListener("click", () => {
  tasks[currentTab] = tasks[currentTab].filter((task) => !task.completed);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
});

taskList.addEventListener("dragover", (e) => {
  e.preventDefault(); // allow drop
});

taskList.addEventListener("drop", (e) => {
  e.preventDefault();

  const fromIndex = e.dataTransfer.getData("text/plain");

  const target = e.target.closest(".task");
  if (!target) return;

  const toIndex = target.dataset.index;

  // Swap logic
  const movedTask = tasks[currentTab].splice(fromIndex, 1)[0];
  tasks[currentTab].splice(toIndex, 0, movedTask);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
});

/* Render Tasks */
function renderTasks() {
  taskList.innerHTML = "";

  const container = document.querySelector(".todo-container");
  container.style.display = tasks[currentTab].length === 0 ? "none" : "block";

  tasks[currentTab].forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task";
    div.dataset.index = index; // ✅ Always update dataset.index

    div.innerHTML = `
      <div class="task-left">
        <label class="custom-checkbox">
          <input type="checkbox" ${task.completed ? "checked" : ""}>
          <span class="checkmark"></span>
        </label>
        <span class="task-text ${task.completed ? "completed" : ""}">${task.text}</span>
      </div>
      <i class="fa-regular fa-trash-can text-danger"></i>
    `;

    // Toggle complete
    div
      .querySelector("input")
      .addEventListener("change", () => toggleTask(index));

    // Delete task dynamically using dataset.index
    div.querySelector("i").addEventListener("click", (e) => {
      const idx = Number(e.target.closest(".task").dataset.index);
      deleteTask(idx);
    });

    // Drag & Drop
    div.setAttribute("draggable", true);
    div.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", index);
    });

    // Editable
    const span = div.querySelector(".task-text");
    span.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = task.text;
      input.className = "form-control";
      span.replaceWith(input);
      input.focus();

      const saveTask = () => {
        task.text = input.value.trim() || task.text;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
      };

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveTask();
      });
      input.addEventListener("blur", saveTask);
    });

    taskList.appendChild(div);
  });
}

renderTasks();

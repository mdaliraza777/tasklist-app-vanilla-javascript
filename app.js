const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const taskStats = document.getElementById("taskStats");
const searchInput = document.getElementById("searchInput");
const themeBtn = document.getElementById("themeBtn");
const priorityInput = document.getElementById("priorityInput");
const dueDateInput = document.getElementById("dueDateInput");

const allBtn = document.getElementById("allTask");
const completedBtn = document.getElementById("completedTask");
const pendingBtn = document.getElementById("pendingTask");

let todos = [];
let editId = null;
let searchText = "";
let currentFilter = "all";

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  console.log(document.body.classList);

  if (document.body.classList.contains("dark-mode")) {
    themeBtn.textContent = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    themeBtn.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
});

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeBtn.textContent = "☀️ Light Mode";
  }
}

//Event for rendering searched task
searchInput.addEventListener("input", (event) => {
  searchText = event.target.value.toLowerCase().trim();
  // console.log(searchText);
  renderTodos();
});

// Event for rendering all tasks
allBtn.addEventListener("click", () => {
  currentFilter = "all";
  console.log(currentFilter);
  renderTodos();
});

// Event for rendering completed tasks
completedBtn.addEventListener("click", () => {
  currentFilter = "completed";
  console.log(currentFilter);
  renderTodos();
});

// Event for rendering pending tasks
pendingBtn.addEventListener("click", () => {
  currentFilter = "pending";
  console.log(currentFilter);
  renderTodos();
});

//Calculate TaskStats(No of task, calculated tasks, pending tasks)
const updateTaskStats = () => {
  const totalTask = todos.length;

  const completedTasks = todos.filter((todo) => {
    return todo.completed;
  }).length;

  const pendingTasks = todos.filter((todo) => {
    return !todo.completed;
  }).length;

  taskStats.textContent = `📋Total task: ${totalTask} || ✅Completed: ${completedTasks} || ⏳Pending: ${pendingTasks}`;
};

// Function to save data in LocalStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
  console.log("Saved:", todos);
}

//Function to load all todo from localstorage
const loadTodos = () => {
  const data = localStorage.getItem("todos");
  if (data) {
    todos = JSON.parse(data);
  }
  renderTodos();
};

//Function to delete all task at single click
const deleteAllTasks = () => {
  const isConfirmed = confirm("Delete all tasks");
  if (!isConfirmed) return;
  todos = [];
  renderTodos();
  saveTodos();
};

const renderTodos = () => {
  todoList.innerHTML = "";
  if (todos.length < 2) {
    deleteAllBtn.style.display = "none";
  } else {
    deleteAllBtn.style.display = "inline-block";
  }

  let filterTodos = todos;

  if (currentFilter === "completed") {
    filterTodos = todos.filter((todo) => {
      return todo.completed;
    });
  }
  if (currentFilter === "pending") {
    filterTodos = todos.filter((todo) => {
      return !todo.completed;
    });
  }

  // for searching functionality
  filterTodos = filterTodos.filter((todo) => {
    // searchText = searchText.toLowerCase().trim();
    return todo.text.toLowerCase().includes(searchText);
  });

  filterTodos.forEach((todo) => {
    //Creating list element
    const li = document.createElement("li");
    li.classList.add("todo-card");

    const taskInfo = document.createElement("div");
    taskInfo.classList.add("task-info");

    const taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");

    let priorityIcon = "";
    if (todo.priority === "high") {
      priorityIcon = "🔴";
    } else if (todo.priority === "medium") {
      priorityIcon = "🟡";
    } else {
      priorityIcon = "🟢";
    }

    //Creating delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";

    // Creating Complete task button
    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn");
    if (todo.completed) {
      completeBtn.textContent = "Incomplete";
    } else {
      completeBtn.textContent = "Complete";
    }

    // Creating Edit button
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.textContent = "edit";
    taskInfo.innerHTML = ` <strong>${priorityIcon} ${todo.text}</strong>
    <br>
    <small> 📅 Due: ${todo.dueDate || "No Due Date"} </small>
    `;

    taskActions.appendChild(deleteBtn);
    taskActions.appendChild(completeBtn);
    taskActions.appendChild(editBtn);

    li.appendChild(taskInfo);
    li.appendChild(taskActions);

    todoList.appendChild(li);

    // Add Event on delete button
    deleteBtn.addEventListener("click", () => {
      todos = todos.filter((item) => {
        return item.id !== todo.id;
      });
      renderTodos();
      saveTodos();
    });

    // Add event on Complete button
    completeBtn.addEventListener("click", () => {
      todo.completed = !todo.completed;
      renderTodos();
      saveTodos();
    });

    // Add event when edit button Clicked
    editBtn.addEventListener("click", () => {
      taskInput.value = todo.text;
      addBtn.textContent = "Update Task";
      editId = todo.id;
    });

    if (todo.completed) {
      li.classList.add("completed");
    } else {
    }
  });

  //  Function Call to calculate task Stats
  updateTaskStats();
};

// Function to add task
function addTodo() {
  console.log("Button clicked");
  const task = taskInput.value.trim();
  const taskPriority = priorityInput.value;
  const dueDate = dueDateInput.value;
  // console.log(taskPriority);
  //   if(task == ""){
  //     return;
  //   }

  if (!task) return; // do nothing when task is Empty

  if (editId !== null) {
    todos.forEach((todo) => {
      if (todo.id === editId) {
        todo.text = task;
      }
    });
    editId = null;
    addBtn.textContent = "Add Task";
    // taskInput.value = "";
    renderTodos();
    // saveTodos(); // Edited  while fixing bug
  } else {
    const todo = {
      id: Date.now(),
      text: task,
      completed: false,
      priority: taskPriority,
      dueDate: dueDate,
    };

    todos.push(todo);
    taskInput.value = "";
    console.log(todos);

    taskInput.value = "";
    priorityInput.value = "";
    dueDateInput.value = "";

    renderTodos();
    saveTodos();
  }
}

// Event for "Enter Key Support": add task when enter key pressed
taskInput.addEventListener("keydown", (event) => {
  // console.log(event);
  if (event.key === "Enter") {
    addTodo();
  }
});

addBtn.addEventListener("click", addTodo);
deleteAllBtn.addEventListener("click", deleteAllTasks);
loadTodos();
loadTheme();

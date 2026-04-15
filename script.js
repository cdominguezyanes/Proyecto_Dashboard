// Campo donde el usuario escribe la tarea
const input = document.getElementById("taskInput");

// Botón para agregar tarea
const button = document.getElementById("addTaskBtn");

// Contenedor donde aparecerán las tareas
const taskList = document.getElementById("taskList");

// Elementos de total de tareas
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progressTasks = document.getElementById("progress");

// Botones de ordenamiento
const sortAZ = document.getElementById("sortAZ");
const sortZA = document.getElementById("sortZA");
const completeAll = document.getElementById("completeAll");

// Modelo de datos
let tasks = [];

// Guardar en LocalStorage
function saveTasks() {
   localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
   const saved = localStorage.getItem("tasks");
   if (saved) {
      tasks = JSON.parse(saved);
   }
}

// Ordenar A-Z
sortAZ.addEventListener("click", function() {
   const items = Array.from(document.querySelectorAll(".task-item"));
   items.sort((a, b) => a.querySelector("span").textContent.toLowerCase()
                        .localeCompare(b.querySelector("span").textContent.toLowerCase()));
   taskList.innerHTML = "";
   items.forEach(task => taskList.appendChild(task));
});

// Ordenar Z-A
sortZA.addEventListener("click", function() {
   const items = Array.from(document.querySelectorAll(".task-item"));
   items.sort((a, b) => b.querySelector("span").textContent.toLowerCase()
                        .localeCompare(a.querySelector("span").textContent.toLowerCase()));
   taskList.innerHTML = "";
   items.forEach(task => taskList.appendChild(task));
});

// Marcar todas como completadas
completeAll.addEventListener("click", function() {
   tasks.forEach(task => task.completed = true);
   saveTasks();
   renderTasks();
});

// Botón agregar tarea
button.addEventListener("click", function() {
   createTask();
});

input.addEventListener("keypress", function(tecla) {
   if (tecla.key === "Enter") {
      createTask();
   }
});

function updateStats() {
   const stats = getStats();
   totalTasks.textContent = stats.total;
   completedTasks.textContent = stats.done;
   pendingTasks.textContent = stats.pending;
   progressTasks.textContent = stats.percentage + "%";

   // Color dinámico (Reto 3 opcional)
   const statsSection = document.querySelector(".task-stats");
   statsSection.style.color = stats.percentage < 50 ? "red" : "green";
}

function getStats() {
   const total = tasks.length;
   const done = tasks.filter(t => t.completed).length;
   return {
      total,
      done,
      pending: total - done,
      percentage: total > 0 ? Math.round((done / total) * 100) : 0
   };
}

function renderTasks() {
   taskList.innerHTML = "";
   tasks.forEach((task, index) => {
      const taskItem = document.createElement("div");
      taskItem.classList.add("task-item");

      const taskLeft = document.createElement("div");
      taskLeft.classList.add("task-left");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;

      const span = document.createElement("span");
      span.textContent = task.text;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.classList.add("delete-btn");

      const editButton = document.createElement("button");
      editButton.textContent = "Editar";
      editButton.classList.add("edit-btn");

      // 📌 BOTÓN FIJAR
      const pinButton = document.createElement("button");
      pinButton.textContent = "📌 Fijar";
      pinButton.classList.add("pin-btn");

      if (task.completed) {
         taskItem.classList.add("completed");
      }

      // 🟢 Eliminar
      deleteButton.addEventListener("click", () => deleteTask(index));

      // 🟢 Completar
      checkbox.addEventListener("change", () => {
         tasks[index].completed = checkbox.checked;
         taskItem.classList.toggle("completed", checkbox.checked);
         saveTasks();
         renderTasks();
      });

      // 🟡 Editar
      editButton.addEventListener("click", () => {
         const inputEdit = document.createElement("input");
         inputEdit.type = "text";
         inputEdit.value = task.text;

         taskLeft.replaceChild(inputEdit, span);
         inputEdit.focus();

         inputEdit.addEventListener("blur", () => {
            const nuevoTexto = inputEdit.value.trim();

            if (nuevoTexto.length >= 5) {
               tasks[index].text = nuevoTexto;
               saveTasks();
            }

            renderTasks();
         });
      });

      // 🔵 FIJAR ARRIBA
      pinButton.addEventListener("click", () => {
         const tareaFijada = tasks.splice(index, 1)[0]; // quitar
         tasks.unshift(tareaFijada); // poner al inicio
         saveTasks();
         renderTasks();
      });

      taskLeft.appendChild(checkbox);
      taskLeft.appendChild(span);

      const dateSpan = document.createElement("span");
      dateSpan.classList.add("task-date");
      dateSpan.textContent = "Creada: " + task.date;
      taskLeft.appendChild(dateSpan);
      dateSpan.textContent = "Creada: " + (task.date || "Sin fecha");

      // 🔥 Agregar botones
      taskItem.appendChild(taskLeft);
      taskItem.appendChild(pinButton);
      taskItem.appendChild(editButton);
      taskItem.appendChild(deleteButton);

      taskList.appendChild(taskItem);
   });
   updateStats();
}

function deleteTask(index) {
   tasks.splice(index, 1);
   saveTasks();
   renderTasks();
}

function addTask(taskText) {
   const message = document.getElementById("message");

   if (taskText === "") {
      message.textContent = "Por favor escribe una tarea.";
      return;
   }

   // 🚨 Validación de mínimo 5 caracteres
   if (taskText.length < 5) {
      message.textContent = "La tarea debe tener al menos 5 caracteres.";
      return;
   }

   // 🚫 Evitar duplicados
   const exists = tasks.some(t => t.text.toLowerCase() === taskText.toLowerCase());
   if (exists) {
      message.textContent = "La tarea ya existe, ingresa una diferente.";
      return;
   }

   // Si todo está correcto, limpiar mensaje
   message.textContent = "";

   const newTask = {
   text: taskText,
   completed: false,
   date: new Date().toLocaleDateString()
};
   tasks.push(newTask);
   saveTasks();
   renderTasks();
}


function createTask() {
   addTask(input.value.trim());
   input.value = "";
}

// Inicialización
loadTasks();
renderTasks();

// Borrar todas las tareas
function deleteAllTasks() {
   tasks = [];
   saveTasks();
   renderTasks();
}
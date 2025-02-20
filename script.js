document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let input = document.getElementById("taskInput");
    let taskText = input.value.trim();
    if (taskText === "") return;

    let li = document.createElement("li");
    li.className = "flex items-center justify-between p-2 border rounded-lg";

    li.innerHTML = `
        <div class="flex items-center">
            <input type="checkbox" class="mr-2" onchange="updateCount()">
            <span class="task-text">${taskText}</span>
        </div>
        <div class="space-x-2">
            <button onclick="editTask(this)" class="text-blue-100 hover:text-blue-400">
                <i class="fa-solid fa-pencil"></i> 
            </button>
            <button onclick="toggleStrike(this)" class="text-blue-100 hover:text-blue-400">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `

    document.getElementById("taskList").appendChild(li);
    saveTasks();
    input.value = "";
    updateCount();
}

function updateCount() {
    let tasks = document.querySelectorAll("#taskList li").length;
    let completed = document.querySelectorAll("#taskList input:checked").length;
    document.getElementById("taskCount").innerHTML = `${completed} of ${tasks} tasks done`;
}

function removeChecked() {
    document.querySelectorAll("#taskList input:checked").forEach(el => {
        let taskText = el.parentElement.querySelector(".task-text");
        taskText.classList.add("line-through", "text-gray-400");
        el.disabled = true; // Désactive la case cochée après suppression
    });
    saveTasks();
}

function toggleStrike(button) {
    let taskText = button.parentElement.parentElement.querySelector(".task-text");
    taskText.classList.toggle("line-through"); 
    taskText.classList.toggle("text-gray-400");
    saveTasks();
}

function editTask(button) {
    let taskText = button.parentElement.parentElement.querySelector(".task-text");
    let newText = prompt("Modifier la tâche:", taskText.innerText);
    if (newText !== null && newText.trim() !== "") {
        taskText.innerText = newText;
        saveTasks();
    }
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.querySelector(".task-text").innerText,
            completed: li.querySelector("input").checked,
            deleted: li.querySelector(".task-text").classList.contains("line-through"),
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => {
        let li = document.createElement("li");
        li.className = "flex items-center justify-between p-2 border rounded-lg";
        li.innerHTML = `
            <div class="flex items-center">
                <input type="checkbox" class="mr-2" ${task.completed ? "checked" : ""} onchange="updateCount()">
                <span class="task-text ${task.deleted ? "line-through text-gray-400" : ""}">${task.text}</span>
            </div>
            <div class="space-x-2">
                <button onclick="editTask(this)" class="text-blue-100 hover:text-blue-400">
                    <i class="fa-solid fa-pencil"></i>
                </button>
                <button onclick="toggleStrike(this)" class="text-blue-100 hover:text-blue-400">
                   <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;
        document.getElementById("taskList").appendChild(li);
    });
    updateCount();
}
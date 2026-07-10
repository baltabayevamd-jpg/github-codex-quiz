const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
const shortMonths = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
const storageKey = "bright-daily-calendar-v2";

let selectedDate = getIsoDate(new Date());
let activeFilter = "all";
let tasks = loadTasks();
let toastTimer;

const weekGrid = document.querySelector("#weekGrid");
const taskList = document.querySelector("#taskList");
const taskForm = document.querySelector("#taskForm");
const taskTime = document.querySelector("#taskTime");
const taskTitle = document.querySelector("#taskTitle");
const taskPlace = document.querySelector("#taskPlace");
const toast = document.querySelector("#toast");

function getMonday(date) {
  const copy = new Date(date);
  const day = copy.getDay() || 7;
  copy.setDate(copy.getDate() - day + 1);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function getIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(date) {
  return `${date.getDate()} ${shortMonths[date.getMonth()]}`;
}

function loadTasks() {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    return JSON.parse(saved);
  }

  const monday = getMonday(new Date());
  const today = getIsoDate(new Date());
  const iso = (offset) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + offset);
    return getIsoDate(date);
  };

  return [
    createTask(today, "09:00", "Главное дело дня", "Дом или офис", "done", true),
    createTask(today, "12:30", "Встреча или звонок", "Онлайн", "ontime", false),
    createTask(today, "18:00", "Незавершенная задача", "Личный список", "missed", false),
    createTask(iso(0), "09:00", "Планерка и список главных дел", "Офис", "ontime", true),
    createTask(iso(0), "13:30", "Позвонить клиенту и подтвердить встречу", "Телефон", "missed", false),
    createTask(iso(1), "10:00", "Встреча с командой проекта", "Переговорная", "done", true),
    createTask(iso(2), "08:30", "Сдать отчет руководителю", "Онлайн", "missed", true),
    createTask(iso(3), "15:00", "Забрать документы", "ЦОН", "ontime", false),
    createTask(iso(4), "17:30", "Тренировка или прогулка", "Парк", "done", false),
    createTask(iso(5), "12:00", "Покупки на неделю", "Супермаркет", "missed", false)
  ];
}

function saveTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function createTask(date, time, title, place, status = "missed", priority = false) {
  return {
    id: `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date,
    time,
    title,
    place,
    status,
    priority
  };
}

function render() {
  renderWeek();
  renderTasks();
  renderStats();
  renderFocus();
}

function renderWeek() {
  const monday = getMonday(new Date());
  weekGrid.innerHTML = "";

  days.forEach((dayName, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const iso = getIsoDate(date);
    const dayTasks = tasks.filter((task) => task.date === iso);
    const button = document.createElement("button");
    button.className = `day-btn ${iso === selectedDate ? "is-active" : ""}`;
    button.type = "button";
    button.innerHTML = `
      <span class="day-number">${date.getDate()}</span>
      <span>
        <strong>${dayName}</strong>
        <small>${formatDate(date)}</small>
      </span>
      <span class="day-score">${dayTasks.length}</span>
    `;
    button.addEventListener("click", () => {
      selectedDate = iso;
      render();
    });
    weekGrid.append(button);
  });
}

function renderTasks() {
  const date = new Date(`${selectedDate}T12:00:00`);
  const dayIndex = (date.getDay() || 7) - 1;
  const selectedTasks = tasks
    .filter((task) => task.date === selectedDate)
    .filter((task) => activeFilter === "all" || task.status === activeFilter)
    .sort((a, b) => Number(b.priority) - Number(a.priority) || a.time.localeCompare(b.time));

  document.querySelector("#selectedDate").textContent = formatDate(date);
  document.querySelector("#dayTitle").textContent = days[dayIndex];
  taskList.innerHTML = "";

  if (!selectedTasks.length) {
    const empty = document.createElement("article");
    empty.className = "task-card missed";
    empty.innerHTML = `
      <span class="task-time">+</span>
      <div>
        <h3>На этот день пока нет задач</h3>
        <p>Добавьте время, место и дело. Новая задача будет розовой, пока вы ее не отметите.</p>
      </div>
      <div></div>
    `;
    taskList.append(empty);
    return;
  }

  selectedTasks.forEach((task) => {
    const card = document.createElement("article");
    card.className = `task-card ${task.status}`;
    card.innerHTML = `
      <span class="task-time">${task.time}</span>
      <div>
        <h3>${task.title}</h3>
        <p>${task.place || "Место не указано"}</p>
        ${task.priority ? '<span class="priority">важно</span>' : ""}
      </div>
      <div class="task-actions">
        <button class="task-action done" type="button" data-status="done" data-id="${task.id}">✓</button>
        <button class="task-action ontime" type="button" data-status="ontime" data-id="${task.id}">⏱</button>
        <button class="task-action missed" type="button" data-status="missed" data-id="${task.id}">×</button>
        <button class="task-action" type="button" data-priority="${task.id}">★</button>
      </div>
    `;
    taskList.append(card);
  });
}

function renderStats() {
  document.querySelector("#totalCount").textContent = tasks.length;
  document.querySelector("#doneCount").textContent = tasks.filter((task) => task.status === "done").length;
  document.querySelector("#ontimeCount").textContent = tasks.filter((task) => task.status === "ontime").length;
  document.querySelector("#missedCount").textContent = tasks.filter((task) => task.status === "missed").length;
}

function renderFocus() {
  const focus = tasks.find((task) => task.date === selectedDate && task.priority);
  document.querySelector("#focusText").textContent = focus
    ? `${focus.time} — ${focus.title}`
    : "Отметьте важную задачу звездочкой, чтобы она стала фокусом дня.";
}

function setStatus(taskId, status) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) {
    return;
  }

  task.status = status;
  saveTasks();
  render();

  const labels = {
    done: "Задача стала зеленой: выполнено",
    ontime: "Задача стала желтой: выполнено вовремя",
    missed: "Задача стала розовой: не выполнено"
  };
  showToast(labels[status]);
}

function togglePriority(taskId) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) {
    return;
  }

  task.priority = !task.priority;
  saveTasks();
  render();
  showToast(task.priority ? "Задача стала фокусом дня" : "Приоритет снят");
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  tasks.push(createTask(selectedDate, taskTime.value, taskTitle.value.trim(), taskPlace.value.trim()));
  taskForm.reset();
  saveTasks();
  render();
  showToast("Задача добавлена в календарь");
});

taskList.addEventListener("click", (event) => {
  const status = event.target.dataset.status;
  const taskId = event.target.dataset.id;
  const priorityId = event.target.dataset.priority;

  if (status && taskId) {
    setStatus(taskId, status);
  }

  if (priorityId) {
    togglePriority(priorityId);
  }
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderTasks();
  });
});

document.querySelector("#todayBtn").addEventListener("click", () => {
  selectedDate = getIsoDate(new Date());
  activeFilter = "all";
  document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item.dataset.filter === "all"));
  render();
});

render();

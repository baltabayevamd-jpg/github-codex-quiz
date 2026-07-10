const operators = [
  { id: "aida", name: "Аида", skills: ["Алматы", "Астана"], active: true, leads: 1, connected: 8 },
  { id: "timur", name: "Тимур", skills: ["Шымкент", "Караганда"], active: true, leads: 2, connected: 6 },
  { id: "dana", name: "Дана", skills: ["Алматы", "Павлодар"], active: true, leads: 0, connected: 9 },
  { id: "ruslan", name: "Руслан", skills: ["Астана", "Актобе"], active: false, leads: 0, connected: 3 }
];

const leadSeeds = [
  ["Айгерим С.", "+7 701 245 18 44", "Алматы", "Мега-акционный тариф", "Не понял выгоду"],
  ["Ерлан М.", "+7 777 814 02 17", "Астана", "Мега-акционный тариф", "Нужен перезвон"],
  ["Салтанат К.", "+7 705 330 91 22", "Шымкент", "Домашний интернет", "Не подходит пакет"],
  ["Марат Б.", "+7 702 618 70 05", "Караганда", "Мега-акционный тариф", "Дорого"],
  ["Нурия Т.", "+7 747 190 25 11", "Павлодар", "Мега-акционный тариф", "Уже есть другой тариф"],
  ["Арман Р.", "+7 707 511 63 90", "Актобе", "Мобильная связь", "Технически недоступно"]
];

let leads = [
  createLead(0, 11),
  createLead(1, 8),
  createLead(2, 5),
  createLead(3, 2)
];

let selectedLeadId = leads[0].id;
let toastTimer;

const leadList = document.querySelector("#leadList");
const operatorList = document.querySelector("#operatorList");
const reasonChart = document.querySelector("#reasonChart");
const toast = document.querySelector("#toast");
const assignAllBtn = document.querySelector("#assignAllBtn");
const addLeadBtn = document.querySelector("#addLeadBtn");
const rebalanceBtn = document.querySelector("#rebalanceBtn");
const connectBtn = document.querySelector("#connectBtn");
const declineBtn = document.querySelector("#declineBtn");
const reasonSelect = document.querySelector("#reasonSelect");

function createLead(seedIndex, ageMinutes = 0) {
  const seed = leadSeeds[seedIndex % leadSeeds.length];
  return {
    id: `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: seed[0],
    phone: seed[1],
    region: seed[2],
    tariff: seed[3],
    reason: seed[4],
    status: "новый",
    owner: "",
    createdAt: Date.now() - ageMinutes * 60000,
    priority: seed[3] === "Мега-акционный тариф" ? "горячий" : "обычный"
  };
}

function render() {
  renderLeads();
  renderOperators();
  renderDetail();
  renderReasons();
  renderMetrics();
}

function renderLeads() {
  leadList.innerHTML = "";

  const sortedLeads = [...leads].sort((a, b) => b.createdAt - a.createdAt);
  sortedLeads.forEach((lead) => {
    const card = document.createElement("button");
    card.className = `lead-card ${lead.id === selectedLeadId ? "is-selected" : ""}`;
    card.type = "button";
    card.addEventListener("click", () => {
      selectedLeadId = lead.id;
      render();
    });

    const info = document.createElement("div");
    info.innerHTML = `
      <strong>${lead.name}</strong>
      <p>${lead.phone} · ${lead.region}</p>
      <div class="lead-meta">
        <span class="chip ${lead.priority === "горячий" ? "hot" : ""}">${lead.priority}</span>
        <span class="chip">${lead.tariff}</span>
        <span class="chip">${lead.status}</span>
      </div>
    `;

    const time = document.createElement("span");
    time.className = "lead-time";
    time.textContent = `${Math.max(1, Math.round((Date.now() - lead.createdAt) / 60000))} мин`;

    card.append(info, time);
    leadList.append(card);
  });
}

function renderOperators() {
  operatorList.innerHTML = "";

  operators.forEach((operator) => {
    const card = document.createElement("article");
    card.className = "operator-card";
    const workload = Math.min(100, operator.leads * 28);
    card.innerHTML = `
      <span class="avatar">${operator.name.slice(0, 1)}</span>
      <div>
        <strong>${operator.name}</strong>
        <small>${operator.active ? "на линии" : "неактивен"} · ${operator.skills.join(", ")}</small>
        <div class="load-bar"><span style="width: ${workload}%"></span></div>
      </div>
      <span class="operator-count">${operator.leads}</span>
    `;
    operatorList.append(card);
  });
}

function renderDetail() {
  const lead = getSelectedLead();
  if (!lead) {
    return;
  }

  document.querySelector("#detailName").textContent = lead.name;
  document.querySelector("#detailStatus").textContent = lead.status;
  document.querySelector("#detailPhone").textContent = lead.phone;
  document.querySelector("#detailRegion").textContent = lead.region;
  document.querySelector("#detailTariff").textContent = lead.tariff;
  document.querySelector("#detailOwner").textContent = lead.owner || "не назначен";
  reasonSelect.value = lead.reason || "";
}

function renderReasons() {
  const totals = leads.reduce((acc, lead) => {
    if (lead.reason) {
      acc[lead.reason] = (acc[lead.reason] || 0) + 1;
    }
    return acc;
  }, {});

  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...entries.map((entry) => entry[1]));
  reasonChart.innerHTML = "";

  entries.forEach(([reason, count]) => {
    const row = document.createElement("div");
    row.className = "reason-row";
    row.innerHTML = `
      <strong>${reason}</strong>
      <span class="reason-bar"><span style="width: ${(count / max) * 100}%"></span></span>
      <span>${count}</span>
    `;
    reasonChart.append(row);
  });
}

function renderMetrics() {
  const newLeads = leads.filter((lead) => lead.status === "новый").length;
  const activeLeads = leads.filter((lead) => lead.status === "в работе").length;
  const connected = leads.filter((lead) => lead.status === "подключен").length;
  const conversion = Math.round((connected / Math.max(1, leads.length)) * 100);
  const avgAge = leads.reduce((sum, lead) => sum + (Date.now() - lead.createdAt), 0) / Math.max(1, leads.length);
  const minutes = Math.floor(avgAge / 60000);
  const seconds = Math.floor((avgAge % 60000) / 1000);

  document.querySelector("#newCount").textContent = newLeads;
  document.querySelector("#activeCount").textContent = activeLeads;
  document.querySelector("#slaValue").textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  document.querySelector("#conversionValue").textContent = `${conversion}%`;
}

function assignLead(lead) {
  if (!lead || lead.owner) {
    return;
  }

  const available = operators
    .filter((operator) => operator.active)
    .sort((a, b) => {
      const aSkill = a.skills.includes(lead.region) ? -1 : 0;
      const bSkill = b.skills.includes(lead.region) ? -1 : 0;
      return a.leads + aSkill - (b.leads + bSkill);
    });

  const operator = available[0];
  if (!operator) {
    showToast("Нет активных операторов для назначения");
    return;
  }

  lead.owner = operator.name;
  lead.status = "в работе";
  operator.leads += 1;
}

function autoAssignAll() {
  leads.filter((lead) => lead.status === "новый").forEach(assignLead);
  showToast("Новые лиды распределены между активными операторами");
  render();
}

function addLead() {
  const lead = createLead(Math.floor(Math.random() * leadSeeds.length));
  leads.unshift(lead);
  selectedLeadId = lead.id;
  showToast("Поступил новый лид без обновления страницы");
  render();
}

function completeLead(status) {
  const lead = getSelectedLead();
  if (!lead) {
    return;
  }

  if (lead.owner) {
    const owner = operators.find((operator) => operator.name === lead.owner);
    if (owner && owner.leads > 0) {
      owner.leads -= 1;
    }
  }

  lead.status = status;
  if (status === "подключен") {
    lead.reason = "";
    const owner = operators.find((operator) => operator.name === lead.owner);
    if (owner) {
      owner.connected += 1;
    }
  }

  showToast(status === "подключен" ? "Подключение зафиксировано" : "Причина отказа сохранена для аналитики");
  render();
}

function getSelectedLead() {
  return leads.find((lead) => lead.id === selectedLeadId) || leads[0];
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-mode]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    showToast(button.dataset.mode === "supervisor" ? "Включен режим супервайзера" : "Включен режим оператора");
  });
});

assignAllBtn.addEventListener("click", autoAssignAll);
rebalanceBtn.addEventListener("click", autoAssignAll);
addLeadBtn.addEventListener("click", addLead);
connectBtn.addEventListener("click", () => completeLead("подключен"));
declineBtn.addEventListener("click", () => completeLead("отказ"));
reasonSelect.addEventListener("change", (event) => {
  const lead = getSelectedLead();
  if (lead) {
    lead.reason = event.target.value;
    renderReasons();
  }
});

setInterval(() => {
  addLead();
}, 14000);

setInterval(renderMetrics, 1000);

render();

const filterButtons = document.querySelectorAll(".filter");
const tariffCards = document.querySelectorAll(".tariff-card");
const autoStatus = document.querySelector("#autoStatus");
const pageLinks = document.querySelectorAll(".page-link");
const bookPages = document.querySelectorAll(".book-page");
const pageCounter = document.querySelector("#pageCounter");
const prevPageButton = document.querySelector("#prevPage");
const nextPageButton = document.querySelector("#nextPage");
const pageOrder = [...pageLinks].map((link) => link.dataset.pageTarget);
let currentPageIndex = Math.max(0, pageOrder.indexOf(location.hash.replace("#", "")));

function showPage(pageKey, updateHash = true) {
  const nextIndex = Math.max(0, pageOrder.indexOf(pageKey));
  const nextPage = pageOrder[nextIndex] || "overview";
  currentPageIndex = nextIndex;

  bookPages.forEach((page) => {
    page.classList.toggle("is-active", page.dataset.page === nextPage);
    if (page.dataset.page === nextPage) {
      page.scrollTop = 0;
    }
  });

  pageLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.pageTarget === nextPage);
  });

  if (pageCounter) {
    pageCounter.textContent = `${String(currentPageIndex + 1).padStart(2, "0")} / ${String(pageOrder.length).padStart(2, "0")}`;
  }

  if (prevPageButton) {
    prevPageButton.disabled = currentPageIndex === 0;
  }

  if (nextPageButton) {
    nextPageButton.disabled = currentPageIndex === pageOrder.length - 1;
  }

  if (updateHash) {
    history.replaceState(null, "", `#${nextPage}`);
  }
}

pageLinks.forEach((link) => {
  link.addEventListener("click", () => showPage(link.dataset.pageTarget));
});

document.querySelectorAll(".nav a, .hero__actions a").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = link.getAttribute("href")?.replace("#", "");
    if (pageOrder.includes(target)) {
      event.preventDefault();
      showPage(target);
    }
  });
});

prevPageButton?.addEventListener("click", () => {
  showPage(pageOrder[Math.max(0, currentPageIndex - 1)]);
});

nextPageButton?.addEventListener("click", () => {
  showPage(pageOrder[Math.min(pageOrder.length - 1, currentPageIndex + 1)]);
});

window.addEventListener("hashchange", () => {
  const target = location.hash.replace("#", "");
  if (pageOrder.includes(target)) {
    showPage(target, false);
  }
});

showPage(pageOrder[currentPageIndex] || "overview", false);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    tariffCards.forEach((card) => {
      const isVisible = filter === "all" || card.dataset.type === filter;
      card.classList.toggle("is-hidden", !isVisible);
    });
  });
});

const channels = {
  kazakh: {
    title: "Казахстанские каналы",
    note: "Базовый локальный слой в расширенном пакете 180+.",
    items: ["QAZAQSTAN", "Хабар", "Хабар 24", "Балапан", "Ел Арна", "QAZSPORT", "Kazakh TV", "КТК", "НТК", "Астана"]
  },
  movies: {
    title: "Фильмы и сериалы",
    note: "Один из самых заметных блоков пакета TTC TV.",
    items: ["Мужское кино", "Киносерия", "Индийское кино", "Кинокомедия", "Наше новое кино", "Родное кино", "Киномикс", "Дом Кино", "Дом Кино Премиум", "Победа", "Cinema", "Индия", "Bollywood", "Q KinoAlem", "Q KinoHit", "A1", "Кинохит", "Киносвидание", "Киносемья", "Кинопремьера", "Киноужас", "НСТ", "Amedia Premium", "Amedia HIT", "viju TV 1000", "viju TV 1000 Action", "ТВ 1000 Русское кино", "Дорама", "START World", "RED", "BLACK", "Sci-Fi"]
  },
  kids: {
    title: "Детские каналы",
    note: "Категория важна для семейных интернет+TV-пакетов.",
    items: ["Карусель Int", "О!", "Tiji", "Мульт", "Cartoon Network", "Nickelodeon", "Nick Jr.", "[KAZ] Nickelodeon", "СТС Kids", "Kids TV"]
  },
  sport: {
    title: "Спортивные каналы",
    note: "Спорт усиливает ценность TV-пакета, особенно при сравнении с отдельными платными пакетами конкурентов.",
    items: ["Eurosport 1", "Eurosport 2", "inSport", "MMA-TV.COM", "Q Sport", "Q Sport Extra", "inTennis", "Матч! Планета", "UDAR", "viju Sport", "Бокс ТВ", "КХЛ"]
  },
  english: {
    title: "Языковые и иностранные версии",
    note: "Нишевый охват для англоязычного, казахского и корейского контента.",
    items: ["[ENG] Nick Jr.", "[ENG] Eurosport 1", "[ENG] Eurosport 2", "[ENG] .Black", "[ENG] .Sci-Fi", "[ENG] .Red", "[ENG] Viasat History", "[ENG] Travel+Adventure", "[ENG] Cartoon Network", "[ENG] Museum", "[ENG] TV 1000", "[ENG] TV 1000 Action", "[KOR] Дорама", "[ENG] viju Sport", "[ENG] Nickelodeon", "[ENG] Amedia Hit HD", "[KAZ] Nick Jr.", "[KAZ] Nickelodeon"]
  },
  cognitive: {
    title: "Познавательные и lifestyle",
    note: "Категория помогает продавать TV как семейный универсальный пакет.",
    items: ["Глазами туриста", "Кто есть кто", "English Club TV", "Поехали", "HDL", "Бобер", "Время: Далекое и Близкое", "Музыка Первого", "Телекафе", "КВН ТВ", "Кухня ТВ", "365 дней ТВ", "Авто Плюс", "Т24", "Живая природа"]
  }
};

const channelTabs = document.querySelectorAll(".channel-tab");
const channelPanel = document.querySelector("#channelPanel");

function renderChannels(key) {
  const group = channels[key] || channels.kazakh;

  channelTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.channel === key);
  });

  if (!channelPanel) {
    return;
  }

  channelPanel.innerHTML = `
    <div class="channel-panel__head">
      <div>
        <span>Пакет 180+</span>
        <h3>${group.title}</h3>
      </div>
      <strong>${group.items.length} каналов в списке</strong>
    </div>
    <p>${group.note}</p>
    <ul>
      ${group.items.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;
}

channelTabs.forEach((tab) => {
  tab.addEventListener("click", () => renderChannels(tab.dataset.channel));
});

renderChannels("kazakh");

async function loadAutoStatus() {
  if (!autoStatus) {
    return;
  }

  try {
    const response = await fetch("data/ttc-data.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("data unavailable");
    }

    const data = await response.json();
    const date = data.last_checked || "ожидает проверки";
    autoStatus.innerHTML = `
      <span>Автообновление</span>
      <strong>последняя проверка: ${date}</strong>
      <small>GitHub Actions ежедневно проверяет источник: ttc.kz/ru/b2c</small>
    `;
  } catch {
    autoStatus.innerHTML = `
      <span>Автообновление</span>
      <strong>данные проверяются ежедневно</strong>
      <small>Если источник недоступен, сайт сохраняет последний ручной срез</small>
    `;
  }
}

loadAutoStatus();

const bars = document.querySelectorAll(".bar-row i");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.animate(
      [
        { transform: "scaleX(0)", transformOrigin: "left" },
        { transform: "scaleX(1)", transformOrigin: "left" }
      ],
      { duration: 850, easing: "cubic-bezier(.2,.8,.2,1)", fill: "both" }
    );
    observer.unobserve(entry.target);
  });
}, { threshold: 0.35 });

bars.forEach((bar) => observer.observe(bar));

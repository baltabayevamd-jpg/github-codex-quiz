const modules = {
  security: {
    title: "Безопасный город",
    text: "Комплексная безопасность жизни населения: видеонаблюдение, контроль инцидентов и снижение количества нарушений.",
    focus: "Безопасность городской среды",
    effect: "Меньше происшествий и порчи имущества"
  },
  lighting: {
    title: "Smart-освещение",
    text: "Интеллектуальное уличное освещение снижает потребление энергии и эксплуатационные расходы городских служб.",
    focus: "Управление световыми постами",
    effect: "До 48% экономии электроэнергии и до 40% по расходам"
  },
  education: {
    title: "Smart-образование",
    text: "Система повышает оперативность мониторинга образования и упрощает взаимодействие родителей, учеников и сотрудников сферы образования.",
    focus: "Цифровое взаимодействие в образовании",
    effect: "Экономия до 300 тыс. человеко-часов в год"
  },
  telemetry: {
    title: "Smart-телеметрия",
    text: "Автоматизированный учет ресурсов сокращает количество оборудования, программных решений, персонала и затрат на связь.",
    focus: "Сбор и передача данных учета",
    effect: "Снижение стоимости услуг телеметрии"
  },
  housing: {
    title: "Smart-ЖКХ",
    text: "Интеллектуальные системы учета и мониторинга помогают выявлять аварии, утечки энергии и несанкционированный отбор.",
    focus: "Коммунальная инфраструктура",
    effect: "До 80% снижение потерь от аварийных ситуаций и утечек"
  }
};

const moduleCard = document.querySelector("#moduleCard");
const moduleTabs = document.querySelectorAll(".module-tab");

function renderModule(key) {
  const item = modules[key];
  if (!item || !moduleCard) {
    return;
  }

  moduleTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.module === key);
  });

  moduleCard.innerHTML = `
    <span class="module-card__label">Активный модуль</span>
    <h3>${item.title}</h3>
    <p>${item.text}</p>
    <dl>
      <div>
        <dt>Фокус</dt>
        <dd>${item.focus}</dd>
      </div>
      <div>
        <dt>Эффект</dt>
        <dd>${item.effect}</dd>
      </div>
    </dl>
  `;
}

moduleTabs.forEach((tab) => {
  tab.addEventListener("click", () => renderModule(tab.dataset.module));
});

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const counter = entry.target;
    const target = Number(counter.dataset.count || 0);
    const duration = 850;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased).toLocaleString("ru-RU");

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
    counterObserver.unobserve(counter);
  });
}, { threshold: 0.4 });

counters.forEach((counter) => counterObserver.observe(counter));

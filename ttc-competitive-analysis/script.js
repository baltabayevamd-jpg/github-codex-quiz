const filterButtons = document.querySelectorAll(".filter");
const tariffCards = document.querySelectorAll(".tariff-card");

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

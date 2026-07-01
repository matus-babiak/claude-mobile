document.getElementById("year").textContent = new Date().getFullYear();

/* Scroll progress bar */
const progressBar = document.getElementById("progressBar");
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${pct}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

/* Reveal on scroll */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* Animated stat counters (trust bar) */
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll(".stat-num").forEach((el) => countObserver.observe(el));

/* Benefits tabs */
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;

    tabButtons.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    tabPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === target);
    });
  });
});

/* FAQ accordion */
document.querySelectorAll(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item.open").forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove("open");
        openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        openItem.querySelector(".faq-answer").style.maxHeight = null;
      }
    });

    item.classList.toggle("open", !isOpen);
    question.setAttribute("aria-expanded", String(!isOpen));
    answer.style.maxHeight = !isOpen ? `${answer.scrollHeight}px` : null;
  });
});

/* Urgency countdown (demo date — replace with a real, truthful deadline) */
const countdownEl = document.getElementById("countdown");
if (countdownEl) {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 4);
  deadline.setHours(23, 59, 59, 0);

  function updateCountdown() {
    const diff = deadline.getTime() - Date.now();
    if (diff <= 0) {
      countdownEl.textContent = "00:00:00:00";
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = (n) => String(n).padStart(2, "0");
    countdownEl.textContent = `${pad(d)}:${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* Custom cursor + hero parallax (fine pointers only) */
if (window.matchMedia("(pointer: fine)").matches) {
  document.body.classList.add("cursor-ready");

  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");
  let mouseX = 0,
    mouseY = 0,
    ringX = 0,
    ringY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorRing.style.width = "50px";
      cursorRing.style.height = "50px";
      cursorRing.style.borderColor = "rgba(124, 92, 255, 0.6)";
    });
    el.addEventListener("mouseleave", () => {
      cursorRing.style.width = "34px";
      cursorRing.style.height = "34px";
      cursorRing.style.borderColor = "rgba(255, 255, 255, 0.35)";
    });
  });

  const heroBlobs = document.querySelector(".hero-blobs");
  const hero = document.querySelector(".hero");
  if (heroBlobs && hero) {
    hero.addEventListener("mousemove", (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * 30;
      heroBlobs.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
}

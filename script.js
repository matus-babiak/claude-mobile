document.getElementById("year").textContent = new Date().getFullYear();

/* Scroll progress bar */
const progressBar = document.getElementById("progressBar");
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${pct}%`;
}

/* Nav background on scroll */
const nav = document.getElementById("nav");
function updateNav() {
  nav.classList.toggle("scrolled", window.scrollY > 20);
}

window.addEventListener(
  "scroll",
  () => {
    updateProgress();
    updateNav();
  },
  { passive: true }
);
updateProgress();
updateNav();

/* Mobile menu toggle */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* Scrollspy: highlight active nav link */
const sections = document.querySelectorAll("main section[id]");
const navLinkMap = new Map();
document.querySelectorAll(".nav-link").forEach((link) => {
  navLinkMap.set(link.getAttribute("href").slice(1), link);
});

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinkMap.forEach((link) => link.classList.remove("active"));
        const activeLink = navLinkMap.get(entry.target.id);
        if (activeLink) activeLink.classList.add("active");
      }
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);
sections.forEach((section) => spyObserver.observe(section));

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

/* Animated stat counters */
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

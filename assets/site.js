// Intro overlay — plays once per session
const introOverlay = document.getElementById('intro-overlay');
if (introOverlay && !document.documentElement.classList.contains('intro-skip')) {
  sessionStorage.setItem('js_intro', '1');
  setTimeout(() => {
    introOverlay.classList.add('is-leaving');
    introOverlay.addEventListener('animationend', () => introOverlay.remove(), { once: true });
  }, 1700);
}

const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open");
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

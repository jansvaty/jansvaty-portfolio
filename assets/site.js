// Intro overlay — plays once per session
const introOverlay = document.getElementById('intro-overlay');
if (introOverlay && !document.documentElement.classList.contains('intro-skip')) {
  sessionStorage.setItem('js_intro', '1');
  setTimeout(() => {
    introOverlay.classList.add('is-leaving');
    introOverlay.addEventListener('animationend', () => introOverlay.remove(), { once: true });
  }, 1000);
}

// Dark / light mode toggle
document.querySelectorAll('.theme-toggle').forEach((themeToggle) => {
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
});

const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open");
  });
}

// Scroll-triggered reveal. This used to toggle an "is-visible" class and let
// a CSS transition animate opacity/transform on it. That could leave
// elements permanently stuck at opacity:0 with "is-visible" already added
// and nothing visibly wrong in the markup — a race when several elements
// crossed the intersection threshold in the same callback batch (e.g. a
// fast scroll) let a second, competing transition start on top of the
// first, and the two never resolved. Driving the animation explicitly with
// the Web Animations API sidesteps that entirely: it doesn't depend on the
// CSS cascade or a class-change being detected as a transition-worthy
// style change, and `fill: "forwards"` guarantees the end state holds.
const REVEAL_KEYFRAMES = [
  { opacity: 0, transform: "translateY(24px)" },
  { opacity: 1, transform: "translateY(0)" },
];
const REVEAL_OPTIONS = { duration: 560, easing: "ease", fill: "forwards" };

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll(".reveal");

if (prefersReducedMotion) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        observer.unobserve(target);
        target.classList.add("is-visible");
        const anim = target.animate(REVEAL_KEYFRAMES, REVEAL_OPTIONS);
        // fill:"forwards" holds the animation's own end state on the
        // element indefinitely — which also means it outranks any later
        // CSS rule trying to change the same properties (e.g. a :hover
        // lift on a card), since an active animation's effect sits above
        // the normal cascade. .reveal.is-visible already carries the same
        // end values in plain CSS, so once the animation has genuinely
        // finished, cancel it to hand control back to the stylesheet.
        // (anim.finished is not used here — it doesn't reliably resolve
        // for animations created this way, e.g. in a backgrounded tab —
        // so a plain timeout matching the known duration is used instead.)
        setTimeout(() => anim.cancel(), REVEAL_OPTIONS.duration);
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

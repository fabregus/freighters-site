type RevealOptions = {
  selector?: string;
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
};

export function initRevealOnScroll({
  selector = "[data-reveal]",
  rootMargin = "0px 0px -10% 0px",
  threshold = 0.12,
  once = true,
}: RevealOptions = {}) {
  const items = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (!items.length) return;

  // Respect reduced motion
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduceMotion) {
    items.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.classList.add("is-revealed");
        if (once) observer.unobserve(el);
      });
    },
    { root: null, rootMargin, threshold }
  );

  items.forEach((el) => observer.observe(el));
}
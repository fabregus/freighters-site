import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function initIndustries() {
  const wrap = document.getElementById("industries-wrap");
  const pin = document.getElementById("industries-pin");
  if (!wrap || !pin) return;

  const panels = gsap.utils.toArray("#industries-pin .industries-panel");
  if (panels.length < 2) return;

  // ✅ Δίνουμε εμείς το scroll distance: N * 100vh
  // (αυτό εξαφανίζει το “mystery” extra gap)
  wrap.style.height = `${panels.length * 100}vh`;

  // ✅ cleanup προηγούμενων triggers (HMR / view transitions safe)
  ScrollTrigger.getAll().forEach((t) => {
    if (t?.vars?.id === "industries") t.kill(true);
  });
  gsap.killTweensOf(panels);

  const tween = gsap.to(panels, {
    yPercent: -100 * (panels.length - 1),
    ease: "none",
  });

  ScrollTrigger.create({
    id: "industries",
    trigger: wrap,          // ✅ trigger = wrapper
    start: "top top",
    end: "bottom bottom",   // ✅ τελειώνει ακριβώς στο τέλος του wrapper
    pin: pin,               // ✅ pin μόνο το viewport
    pinSpacing: false,      // ✅ δεν δημιουργεί spacer => δεν υπάρχει extra κενό
    animation: tween,

    // “snappy” feel
    scrub: 0.25,
    snap: {
      snapTo: 1 / (panels.length - 1),
      duration: { min: 0.08, max: 0.22 },
      ease: "power2.out",
    },
    anticipatePin: 1,

    invalidateOnRefresh: true,
  });

  ScrollTrigger.refresh();
}

// ✅ σωστό για Astro (και με/χωρίς ViewTransitions)
document.addEventListener("astro:page-load", initIndustries);

// fallback για initial load αν δεν έχεις transitions
if (document.readyState !== "loading") initIndustries();
else document.addEventListener("DOMContentLoaded", initIndustries, { once: true });
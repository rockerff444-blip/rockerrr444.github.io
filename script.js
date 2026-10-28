/* ==========================================================================
   ROCKER | script.js
   Vanilla JavaScript only. No libraries, no build step.

   ┌──────────────────────────────────────────────────────────────────────┐
   │  1. SOCIAL LINKS: THE ONLY PART YOU NEED TO EDIT                     │
   └──────────────────────────────────────────────────────────────────────┘
   Replace each value between the quotes with your real URL.
   Every card and every small icon on the page uses these four links.

   ⚠️  WARNING: replace ALL FOUR placeholders before you publish the site.
       Any URL that still contains "YOUR_" is a placeholder and will lead to
       a page that does not exist. (A reminder is printed in the browser
       console while a placeholder is left in.)

   How to fill each one in:

   instagram  Your profile link.
              Example:  https://instagram.com/yourname

   tiktok     Your profile link. Keep the @ before your username.
              Example:  https://www.tiktok.com/@yourname

   discord    A server invite link (create one in Discord:
              Server menu > Invite People > Edit invite link > Never expires).
              Example:  https://discord.gg/abc123XYZ

   whatsapp   Click-to-chat link: https://wa.me/ followed by your number in
              international format. Digits only: no +, no spaces, no dashes.
              Example for +1 (555) 123-4567:  https://wa.me/15551234567
   ========================================================================== */

const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/the.real.rocker?utm_source=ig_web_button_share_sheet&obrf=ZDNlZDc0MzIxNw==",     // <-- paste your Instagram profile URL
  tiktok:    "https://www.tiktok.com/@rockerrr444",   
  discord:   "https://discord.com/users/1511345388026597410",     
  whatsapp:  "https://wa.me/9779701798210"       
};

/* ==========================================================================
   END OF THE PART YOU NEED TO EDIT. Everything below is site behavior.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     Small helpers
     ------------------------------------------------------------------------ */
  const THEME_KEY = "rocker-theme";
  const MOBILE_QUERY = "(max-width: 720px)";

  /** True when the visitor's device asks for less motion. */
  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /** Safe wrapper around localStorage (it can throw in private or locked-down modes). */
  const storage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
    }
  };


  /* ------------------------------------------------------------------------
     Social links
     Copies the URLs from SOCIAL_LINKS onto every element marked with
     data-social="name" (the cards and the small icons).
     ------------------------------------------------------------------------ */
  function applySocialLinks() {
    const leftover = [];

    document.querySelectorAll("[data-social]").forEach((link) => {
      const name = link.dataset.social;
      const url = SOCIAL_LINKS[name];
      if (!url) return;

      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      if (/YOUR_/i.test(url) && leftover.indexOf(name) === -1) leftover.push(name);
    });

    if (leftover.length) {
      console.warn(
        "ROCKER: replace the placeholder link(s) in script.js before publishing: " + leftover.join(", ")
      );
    }
  }


  /* ------------------------------------------------------------------------
     Navigation: mobile menu, sticky-bar styling, active section highlight
     ------------------------------------------------------------------------ */
  function initNavigation() {
    const header = document.getElementById("site-header");
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");
    if (!header) return;

    /* Add a stronger glow to the bar once the page has scrolled. */
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && menu) {
      /** Open or close the mobile menu and keep ARIA attributes in sync. */
      const setMenu = (open) => {
        menu.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      };

      toggle.addEventListener("click", () => {
        setMenu(toggle.getAttribute("aria-expanded") !== "true");
      });

      /* Close after choosing a link. */
      menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

      /* Close with Escape (and return focus to the button). */
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menu.classList.contains("is-open")) {
          setMenu(false);
          toggle.focus();
        }
      });

      /* Close when tapping outside the bar. */
      document.addEventListener("click", (event) => {
        if (!menu.classList.contains("is-open")) return;
        if (!header.contains(event.target)) setMenu(false);
      });

      /* Reset when the screen grows past the mobile breakpoint. */
      const mq = window.matchMedia(MOBILE_QUERY);
      const onChange = (e) => { if (!e.matches) setMenu(false); };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }

    highlightActiveLink();
  }

  /** Marks the nav link of the section currently in view with aria-current. */
  function highlightActiveLink() {
    if (!("IntersectionObserver" in window)) return;

    const links = Array.from(document.querySelectorAll('.nav__link[href^="#"]'));
    const linkById = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const sections = Array.from(document.querySelectorAll("main > section[id]"));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.removeAttribute("aria-current"));
          const active = linkById.get(entry.target.id);
          if (active) active.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-40% 0px -55% 0px" } /* a thin band near the middle of the screen */
    );

    sections.forEach((section) => observer.observe(section));
  }


  /* ------------------------------------------------------------------------
     Smooth scrolling for every in-page link (#home, #socials, #about ...)
     ------------------------------------------------------------------------ */
  function initSmoothScroll() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute("href").slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });

      /* Keep the address bar in sync (can fail on some file:// setups, which is fine). */
      try { history.pushState(null, "", "#" + id); } catch (e) { /* ignore */ }

      /* Move keyboard focus to the section so screen readers follow along. */
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  }


  /* ------------------------------------------------------------------------
     Theme toggle (dark <-> light), remembered between visits
     ------------------------------------------------------------------------ */
  function initThemeToggle() {
    const root = document.documentElement;
    const button = document.getElementById("theme-toggle");
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!button) return;

    /** Applies a theme everywhere it needs to show up. */
    function applyTheme(theme) {
      root.setAttribute("data-theme", theme);
      button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
      if (metaTheme) metaTheme.setAttribute("content", theme === "dark" ? "#050507" : "#F6F2FF");
    }

    applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");

    button.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";

      /* Briefly enable color transitions so the change fades instead of snapping. */
      root.classList.add("theme-transition");
      applyTheme(next);
      storage.set(THEME_KEY, next);
      window.setTimeout(() => root.classList.remove("theme-transition"), 600);
    });
  }


  /* ------------------------------------------------------------------------
     Scroll reveal: fades elements in when they enter the viewport
     ------------------------------------------------------------------------ */
  function initScrollReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    /* Without IntersectionObserver (or with reduced motion) just show everything. */
    if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target); /* reveal once, then stop watching */
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }


  /* ------------------------------------------------------------------------
     Card spotlight: the accent glow follows the mouse across each card.
     Only sets two CSS variables; all styling stays in style.css.
     ------------------------------------------------------------------------ */
  function initCardSpotlight() {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", event.clientX - rect.left + "px");
        card.style.setProperty("--my", event.clientY - rect.top + "px");
      });
    });
  }


  /* ------------------------------------------------------------------------
     Background sparkles: a small number of dots animated purely by CSS.
     Skipped entirely when the visitor prefers reduced motion.
     ------------------------------------------------------------------------ */
  function initSparks() {
    const container = document.getElementById("sparks");
    if (!container || prefersReducedMotion()) return;

    const count = window.innerWidth < 600 ? 14 : 26;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const spark = document.createElement("span");
      spark.className = i % 6 === 0 ? "spark spark--cyan" : "spark";
      spark.style.setProperty("--x", (Math.random() * 100).toFixed(1));
      spark.style.setProperty("--y", (Math.random() * 100).toFixed(1));
      spark.style.setProperty("--s", (2 + Math.random() * 2.5).toFixed(1));
      spark.style.setProperty("--d", (6 + Math.random() * 8).toFixed(1) + "s");
      spark.style.setProperty("--delay", "-" + (Math.random() * 10).toFixed(1) + "s");
      fragment.appendChild(spark);
    }

    container.appendChild(fragment);
  }


  /* ------------------------------------------------------------------------
     Profile image fallback: if the file named in the <img> src can't be
     loaded, show the built-in placeholder so the layout never looks broken.
     ------------------------------------------------------------------------ */
  function initProfileImage() {
    const img = document.getElementById("profile-image");
    if (!img) return;

    const PLACEHOLDER = "assets/profile-placeholder.jpg";
    let swapped = false;

    const useFallback = () => {
      if (swapped) return;
      swapped = true;
      img.src = PLACEHOLDER;
    };

    img.addEventListener("error", useFallback);

    /* The error may already have happened before this script ran. */
    if (img.complete && img.naturalWidth === 0) useFallback();
  }


  /* ------------------------------------------------------------------------
     Footer: current year and back-to-top button
     ------------------------------------------------------------------------ */
  function initFooter() {
    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());

    const backToTop = document.getElementById("back-to-top");
    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      });
    }
  }


  /* ------------------------------------------------------------------------
     Start everything once the page structure is ready
     ------------------------------------------------------------------------ */
  function init() {
    applySocialLinks();
    initNavigation();
    initSmoothScroll();
    initThemeToggle();
    initScrollReveal();
    initCardSpotlight();
    initSparks();
    initProfileImage();
    initFooter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasMotion = typeof window.Motion !== "undefined";

  /* ---------- Header state on scroll ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    header.classList.toggle("scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Scroll progress bar ---------- */
  var progress = document.getElementById("scrollProgress");
  function updateProgress() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  /* ---------- Active nav link ---------- */
  var sectionIds = ["services", "process", "experience", "skills", "contact"];
  var linkMap = {};
  navLinks.querySelectorAll("a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href && href.charAt(0) === "#") linkMap[href.slice(1)] = a;
  });
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        Object.keys(linkMap).forEach(function (id) {
          linkMap[id].classList.toggle("active", id === entry.target.id);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sectionIds.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  /* ---------- Counters ---------- */
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion || !hasMotion) {
      el.textContent = target + suffix;
      return;
    }
    var obj = { value: 0 };
    window.Motion.animate(obj, { value: target }, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: function () {
        el.textContent = Math.round(obj.value) + suffix;
      }
    });
  }
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll("[data-count]").forEach(function (el) {
    counterObserver.observe(el);
  });

  if (reduceMotion || !hasMotion) return;

  var Motion = window.Motion;

  /* ---------- Hero entrance ---------- */
  Motion.animate(
    "[data-hero]",
    { opacity: [0, 1], y: [28, 0] },
    { duration: 0.9, ease: "easeOut", delay: Motion.stagger(0.09) }
  );
  Motion.animate(
    ".hero-visual",
    { opacity: [0, 1], scale: [0.94, 1] },
    { duration: 1.1, ease: "easeOut", delay: 0.25 }
  );
  Motion.animate(
    ".float-card",
    { opacity: [0, 1], y: [16, 0] },
    { duration: 0.7, ease: "easeOut", delay: 0.9 }
  );

  /* ---------- Scroll reveals ---------- */
  Motion.inView("[data-reveal]", function (el) {
    Motion.animate(
      el,
      { opacity: [0, 1], y: [26, 0] },
      { duration: 0.75, ease: "easeOut" }
    );
  }, { margin: "-80px 0px" });

  document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
    var items = group.querySelectorAll("[data-reveal-item]");
    Motion.inView(group, function () {
      Motion.animate(
        items,
        { opacity: [0, 1], y: [30, 0] },
        { duration: 0.7, ease: "easeOut", delay: Motion.stagger(0.1) }
      );
    }, { margin: "-60px 0px" });
  });

  /* ---------- Gentle float on portrait cards ---------- */
  if (!window.matchMedia("(pointer: coarse)").matches) {
    Motion.animate(".float-card-a", { y: [0, -8, 0] }, {
      duration: 4, repeat: Infinity, ease: "easeInOut"
    });
    Motion.animate(".float-card-b", { y: [0, 8, 0] }, {
      duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6
    });
  }
})();

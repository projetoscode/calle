(function () {
  "use strict";

  /* Preloader */
  var preloader = document.getElementById("preloader");
  var fill = document.getElementById("preloaderFill");
  var pct = document.getElementById("preloaderPct");
  var progress = 0;

  function tickPreloader() {
    progress += Math.random() * 18 + 6;
    if (progress >= 100) {
      progress = 100;
      if (fill) fill.style.width = "100%";
      if (pct) pct.textContent = "100%";
      window.setTimeout(function () {
        if (preloader) preloader.classList.add("is-hidden");
      }, 250);
      return;
    }
    if (fill) fill.style.width = progress + "%";
    if (pct) pct.textContent = Math.floor(progress) + "%";
    window.setTimeout(tickPreloader, 180);
  }
  tickPreloader();
  // safety net: never trap the visitor behind the preloader
  window.setTimeout(function () {
    if (preloader) preloader.classList.add("is-hidden");
  }, 2500);

  /* Mobile / full menu */
  var menuOpenBtn = document.getElementById("menuOpen");
  var menuCloseBtn = document.getElementById("menuClose");
  var menuOverlay = document.getElementById("menuOverlay");

  function openMenu() {
    menuOverlay.classList.add("is-open");
    menuOverlay.setAttribute("aria-hidden", "false");
    menuOpenBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    menuOverlay.classList.remove("is-open");
    menuOverlay.setAttribute("aria-hidden", "true");
    menuOpenBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (menuOpenBtn) menuOpenBtn.addEventListener("click", openMenu);
  if (menuCloseBtn) menuCloseBtn.addEventListener("click", closeMenu);
  if (menuOverlay) {
    menuOverlay.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* SEO keywords toggle */
  var seoToggle = document.getElementById("seoToggle");
  var seoKeywords = document.getElementById("seoKeywords");
  if (seoToggle && seoKeywords) {
    seoToggle.addEventListener("click", function () {
      var isHidden = seoKeywords.hasAttribute("hidden");
      if (isHidden) {
        seoKeywords.removeAttribute("hidden");
        seoToggle.setAttribute("aria-expanded", "true");
        seoToggle.textContent = "Ocultar palavras-chave SEO";
      } else {
        seoKeywords.setAttribute("hidden", "");
        seoToggle.setAttribute("aria-expanded", "false");
        seoToggle.textContent = "Ver palavras-chave SEO";
      }
    });
  }

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

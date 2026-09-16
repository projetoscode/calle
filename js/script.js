(function () {
  "use strict";

  /* Preloader */
  var preloader = document.getElementById("preloader");
  var fill = document.getElementById("preloaderFill");
  var pct = document.getElementById("preloaderPct");
  var progress = 0;
  var scrollLockCount = 0;

  function lockScroll() {
    scrollLockCount++;
    document.body.style.overflow = "hidden";
  }
  function unlockScroll() {
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount === 0) document.body.style.overflow = "";
  }

  lockScroll();

  function hidePreloader() {
    if (!preloader || preloader.classList.contains("is-hidden")) return;
    preloader.classList.add("is-hidden");
    unlockScroll();
  }

  function tickPreloader() {
    progress += Math.random() * 18 + 6;
    if (progress >= 100) {
      progress = 100;
      if (fill) fill.style.width = "100%";
      if (pct) pct.textContent = "100%";
      window.setTimeout(hidePreloader, 250);
      return;
    }
    if (fill) fill.style.width = progress + "%";
    if (pct) pct.textContent = Math.floor(progress) + "%";
    window.setTimeout(tickPreloader, 180);
  }
  tickPreloader();
  // safety net: never trap the visitor behind the preloader
  window.setTimeout(hidePreloader, 2500);

  /* Mobile / full menu */
  var menuOpenBtn = document.getElementById("menuOpen");
  var menuCloseBtn = document.getElementById("menuClose");
  var menuOverlay = document.getElementById("menuOverlay");

  var menuIsOpen = false;
  function openMenu() {
    if (menuIsOpen) return;
    menuIsOpen = true;
    menuOverlay.classList.add("is-open");
    menuOverlay.setAttribute("aria-hidden", "false");
    menuOpenBtn.setAttribute("aria-expanded", "true");
    lockScroll();
    if (menuCloseBtn) menuCloseBtn.focus();
  }
  function closeMenu() {
    if (!menuIsOpen) return;
    menuIsOpen = false;
    menuOverlay.classList.remove("is-open");
    menuOverlay.setAttribute("aria-hidden", "true");
    menuOpenBtn.setAttribute("aria-expanded", "false");
    unlockScroll();
    menuOpenBtn.focus();
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

  /* Modal (FAQ / legal placeholders) */
  var modalOverlay = document.getElementById("modalOverlay");
  var modalClose = document.getElementById("modalClose");
  var modalTitle = document.getElementById("modalTitle");
  var modalBody = document.getElementById("modalBody");
  var modalTriggers = document.querySelectorAll("[data-modal]");
  var lastFocused = null;

  function openModal(key) {
    var tpl = document.getElementById("modal-" + key);
    if (!tpl || !modalOverlay) return;
    var titleEl = tpl.content.querySelector("[data-title]");
    var bodyEl = tpl.content.querySelector("[data-body]");
    modalTitle.textContent = titleEl ? titleEl.textContent : "";
    modalBody.innerHTML = bodyEl ? bodyEl.innerHTML : "";
    lastFocused = document.activeElement;
    modalOverlay.hidden = false;
    // next frame, so the transition from hidden->visible actually runs
    window.requestAnimationFrame(function () {
      modalOverlay.classList.add("is-open");
    });
    lockScroll();
    if (modalClose) modalClose.focus();
  }

  function closeModal() {
    if (!modalOverlay || modalOverlay.hidden) return;
    modalOverlay.classList.remove("is-open");
    unlockScroll();
    window.setTimeout(function () {
      modalOverlay.hidden = true;
    }, 350);
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  modalTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      if (menuOverlay && menuOverlay.contains(trigger)) closeMenu();
      openModal(trigger.getAttribute("data-modal"));
    });
  });
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

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

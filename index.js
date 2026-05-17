/**
 * Hebamme Hannah - Interaction & Premium UI Engine
 * Version 1.0 (Intersection Observer Scroll system)
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- Active Nav Link Scroll Observer ---
  const navLinks = document.querySelectorAll(".nav-menu .nav-link");
  
  // We only track actual section IDs on the current page
  const sectionSelectors = ["services", "about", "faq", "blog", "newsletter", "contact"];
  const sections = [];
  
  sectionSelectors.forEach(id => {
    const el = document.getElementById(id);
    if (el) sections.push(el);
  });

  if (sections.length > 0 && navLinks.length > 0) {
    const navObserverOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px", // Activates when the section enters the center viewport zone
      threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          if (!id) return;

          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            // Check if href matches hash on current index page or external path
            if (href === `#${id}` || href.endsWith(`#${id}`)) {
              link.classList.add("active");
            } else if (!link.classList.contains("btn")) {
              // Only remove active if it's a standard nav link and doesn't match
              link.classList.remove("active");
            }
          });
        }
      });
    }, navObserverOptions);

    sections.forEach((section) => navObserver.observe(section));
  }

  // --- Viewport Reveal Scroll Observer ---
  const revealObserverOptions = {
    root: null,
    rootMargin: "0px 0px -8% 0px", // Trigger slightly before entering the full viewport
    threshold: 0.05
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, revealObserverOptions);

  const elementsToReveal = document.querySelectorAll(".reveal-on-scroll");
  elementsToReveal.forEach((el) => {
    revealObserver.observe(el);
  });

  // --- Mobile Hamburger Menu Controller ---
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navMenuLinks = document.querySelectorAll(".nav-menu .nav-link, .nav-menu .btn");

  if (navToggle && navMenu) {
    const toggleMenu = () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !isExpanded);
      navToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
      document.body.style.overflow = isExpanded ? "" : "hidden"; // Prevent background scroll when open
    };

    const closeMenu = () => {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    };

    // Toggle click trigger
    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Auto-close menu drawer when clicking a link
    const closeTriggers = document.querySelectorAll(".nav-menu .nav-link, .nav-menu .btn, .mobile-header-btn");
    closeTriggers.forEach(link => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    // Close menu when clicking outside of it
    document.addEventListener("click", (e) => {
      if (navMenu.classList.contains("active") && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Handle screen resize gracefully
    window.addEventListener("resize", () => {
      if (window.innerWidth > 992 && navMenu.classList.contains("active")) {
        closeMenu();
      }
    });
  }
});

// ui.js - Refactor moderno y optimizado para Astro

document.addEventListener("DOMContentLoaded", () => {
  // --- Menú móvil ---
  let lastScrollTop = 0;
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenu) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;

      if (scrollTop > lastScrollTop && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
      }

      lastScrollTop = scrollTop;
    });
  }

  // --- Animaciones con IntersectionObserver ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        obs.unobserve(entry.target); // optimiza, deja de observar
      }
    });
  }, observerOptions);

  // Convierte el NodeList en Array real para que forEach siempre funcione
  const fadeSections = Array.from(document.querySelectorAll(".fade-section"));
  fadeSections.forEach((section) => observer.observe(section));
});

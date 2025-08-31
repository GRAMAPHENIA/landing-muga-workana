// ui.js

document.addEventListener("DOMContentLoaded", () => {
    // --- Menú móvil ---
    let lastScrollTop = 0;
    const mobileMenu = document.getElementById("mobile-menu");
  
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
  
      if (
        scrollTop > lastScrollTop &&
        mobileMenu &&
        !mobileMenu.classList.contains("hidden")
      ) {
        mobileMenu.classList.add("hidden");
      }
  
      lastScrollTop = scrollTop;
    });
  
    // --- Animaciones con IntersectionObserver ---
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target); // optimiza, deja de observar
        }
      });
    }, observerOptions);
  
    const fadeSections = document.querySelectorAll(".fade-section");
    fadeSections.forEach((section) => observer.observe(section));
  });
  
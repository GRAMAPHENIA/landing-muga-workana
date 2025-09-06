// Optimización de imágenes y lazy loading
(function() {
  'use strict';

  function ImageOptimizer() {
    this.init();
  }

  ImageOptimizer.prototype.init = function() {
    this.setupLazyLoading();
    this.preloadCriticalImages();
    this.optimizeBackgroundImages();
  };

  ImageOptimizer.prototype.setupLazyLoading = function() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Cargar imagen real
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            
            // Cargar srcset si existe
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            
            // Optimizar fetchPriority
            if (entry.intersectionRatio > 0.5) {
              img.fetchPriority = 'high';
            }
            
            img.classList.remove('lazy-load');
            img.classList.add('lazy-loaded');
            
            observer.unobserve(img);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      });

      // Observar todas las imágenes lazy
      const lazyImages = document.querySelectorAll('img[data-src]');
      for (let i = 0; i < lazyImages.length; i++) {
        lazyImages[i].classList.add('lazy-load');
        imageObserver.observe(lazyImages[i]);
      }
    } else {
      // Fallback para navegadores sin IntersectionObserver
      const fallbackImages = document.querySelectorAll('img[data-src]');
      for (let j = 0; j < fallbackImages.length; j++) {
        const img = fallbackImages[j];
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }
      }
    }
  };

  ImageOptimizer.prototype.preloadCriticalImages = function() {
    const criticalImages = document.querySelectorAll('img[data-critical="true"], .hero img, .above-fold img');
    
    for (let k = 0; k < criticalImages.length; k++) {
      const img = criticalImages[k];
      // Preload de imágenes críticas
      if (img.src || img.dataset.src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src || img.dataset.src;
        if (link.fetchPriority) link.fetchPriority = 'high';
        document.head.appendChild(link);
        
        // Marcar como de alta prioridad
        if (img.fetchPriority) img.fetchPriority = 'high';
        img.loading = 'eager';
      }
    }
  };

  ImageOptimizer.prototype.optimizeBackgroundImages = function() {
    const bgElements = document.querySelectorAll('[data-bg-src]');
    
    if ('IntersectionObserver' in window) {
      const bgObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const element = entry.target;
            const bgSrc = element.dataset.bgSrc;
            
            if (bgSrc) {
              element.style.backgroundImage = `url(${bgSrc})`;
              element.removeAttribute('data-bg-src');
              element.classList.add('bg-loaded');
            }
            
            bgObserver.unobserve(element);
          }
        });
      }, { threshold: 0.1 });
      
      for (let m = 0; m < bgElements.length; m++) {
        bgObserver.observe(bgElements[m]);
      }
    } else {
      // Fallback
      for (let n = 0; n < bgElements.length; n++) {
        const element = bgElements[n];
        const bgSrc = element.dataset.bgSrc;
        if (bgSrc) {
          element.style.backgroundImage = `url(${bgSrc})`;
          element.removeAttribute('data-bg-src');
        }
      }
    }
  };

  // Inicializar cuando el script se carga
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      new ImageOptimizer();
    });
  } else {
    new ImageOptimizer();
  }

})();

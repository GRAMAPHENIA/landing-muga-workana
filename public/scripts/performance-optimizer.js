// Optimizador de cadenas críticas y tareas del hilo principal
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.optimizeMainThread();
    this.setupResourceHints();
    this.deferNonCriticalTasks();
  }

  // Dividir tareas largas en chunks más pequeños
  optimizeMainThread() {
    const _originalSetTimeout = window.setTimeout;
    const _originalSetInterval = window.setInterval;

    // Scheduler para dividir tareas largas
    window.yieldToMain = () => {
      return new Promise(resolve => {
        setTimeout(resolve, 0);
      });
    };

    // Wrapper para funciones que pueden bloquear
    window.scheduleWork = async (work, _priority = 'normal') => {
      const startTime = performance.now();
      
      if (typeof work === 'function') {
        // Si la tarea es muy larga, dividirla
        if (work.toString().length > 1000) {
          await this.yieldToMain();
        }
        
        const result = work();
        
        // Si tardó más de 5ms, programar un yield
        if (performance.now() - startTime > 5) {
          await this.yieldToMain();
        }
        
        return result;
      }
    };
  }

  // Configurar hints de recursos para reducir cadenas
  setupResourceHints() {
    // Preconnect a dominios externos críticos
    const externalDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ];

    externalDomains.forEach(domain => {
      if (!document.querySelector(`link[href*="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = `https://${domain}`;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });

    // Prefetch de recursos que se usarán pronto
    this.setupIntelligentPrefetch();
  }

  // Prefetch inteligente basado en interacciones del usuario
  setupIntelligentPrefetch() {
    const prefetchedUrls = new Set();
    
    // Prefetch al hacer hover en enlaces
    document.addEventListener('mouseover', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      
      const href = link.href;
      if (href && href.startsWith(window.location.origin) && !prefetchedUrls.has(href)) {
        this.prefetchPage(href);
        prefetchedUrls.add(href);
      }
    }, { passive: true });

    // Prefetch con Intersection Observer para enlaces visibles
    if ('IntersectionObserver' in window) {
      const linkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target;
            const href = link.href;
            
            if (href && !prefetchedUrls.has(href)) {
              // Prefetch con delay para no sobrecargar
              setTimeout(() => {
                this.prefetchPage(href);
                prefetchedUrls.add(href);
              }, 1000);
            }
            
            linkObserver.unobserve(link);
          }
        });
      }, { rootMargin: '100px' });

      // Observar enlaces importantes
      document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]').forEach(link => {
        linkObserver.observe(link);
      });
    }
  }

  prefetchPage(url) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }

  // Diferir tareas no críticas
  deferNonCriticalTasks() {
    // Usar requestIdleCallback si está disponible
    const scheduleTask = window.requestIdleCallback || 
      ((callback) => setTimeout(callback, 1));

    // Diferir análisis y tracking
    scheduleTask(() => {
      this.initAnalytics();
    });

    // Diferir lazy loading de imágenes below-the-fold
    scheduleTask(() => {
      this.setupLazyLoading();
    });

    // Diferir inicialización de componentes no críticos
    scheduleTask(() => {
      this.initNonCriticalComponents();
    });
  }

  initAnalytics() {
    // Solo inicializar analytics después de que la página esté cargada
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }

  setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"], img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  initNonCriticalComponents() {
    // Inicializar componentes como carruseles, modales, etc.
    const components = document.querySelectorAll('[data-component]');
    
    components.forEach(async (component, index) => {
      // Stagger la inicialización para evitar bloqueos
      await new Promise(resolve => setTimeout(resolve, index * 50));
      
      const componentType = component.dataset.component;
      
      try {
        // Cargar dinámicamente el componente
        const module = await import(`/js/components/${componentType}.js`);
        if (module.default) {
          new module.default(component);
        }
      } catch {
        // Silently handle component loading errors
      }
    });
  }

  // Método para medir performance
  measurePerformance() {
    if ('PerformanceObserver' in window) {
      // Observar Long Tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const _entry of list.getEntries()) {
          if (_entry.duration > 50) {
            // Long task detected - could trigger optimization
          }
        }
      });
      
      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch {
        // longtask no soportado en todos los navegadores
      }

      // Observar LCP
      const lcpObserver = new PerformanceObserver((list) => {
        for (const _entry of list.getEntries()) {
          // LCP measured - could be used for optimization
        }
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch {
        // LCP no soportado
      }
    }
  }
}

// Inicializar solo después de DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
  });
} else {
  new PerformanceOptimizer();
}

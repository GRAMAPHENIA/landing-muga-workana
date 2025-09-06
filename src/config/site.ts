export const siteConfig = {
  name: 'TechSolutions Pro',
  title: 'Desarrollo Web Profesional | TechSolutions Pro',
  description:
    'Agencia de desarrollo web especializada en crear sitios web modernos, aplicaciones web y soluciones digitales para empresas. Diseño responsive, SEO optimizado y resultados medibles.',
  url: 'https://techsolutions-pro.com',
  domain: 'techsolutions-pro.com',
  author: 'TechSolutions Pro',
  email: 'contacto@techsolutions-pro.com',
  phone: '+34 600 123 456',
  address: 'Madrid, España',

  // SEO y Analytics
  seo: {
    keywords: 'desarrollo web, diseño web, aplicaciones web, e-commerce, SEO, marketing digital',
    ogImage: '/rectangle.svg',
    twitterCard: 'summary_large_image',
    googleAnalytics: 'G-XXXXXXXXXX', // Reemplazar con tu ID de GA4
    googleTagManager: 'GTM-XXXXXXX', // Reemplazar con tu ID de GTM
  },

  // Redes sociales
  social: {
    linkedin: 'https://linkedin.com/company/techsolutions-pro',
    twitter: 'https://twitter.com/techsolutions_pro',
    github: 'https://github.com/techsolutions-pro',
    instagram: 'https://instagram.com/techsolutions_pro',
  },

  // Configuración de formularios
  formspree: {
    contactForm: 'https://formspree.io/f/xpznvqjr',
  },

  // Navegación principal (anclas para landing page)
  navigation: [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Nosotros', href: '#nosotros' },
    { name: 'Trabajos', href: '#trabajos' },
    { name: 'Testimonios', href: '#testimonios' },
    { name: 'Contacto', href: '#contacto' },
  ],

  // Servicios principales
  services: [
    {
      title: 'Desarrollo Web',
      description: 'Sitios web modernos, rápidos y optimizados para SEO',
      icon: 'globe',
    },
    {
      title: 'E-commerce',
      description: 'Tiendas online completas con pasarelas de pago',
      icon: 'shopping-cart',
    },
    {
      title: 'Aplicaciones Web',
      description: 'Sistemas web personalizados para tu negocio',
      icon: 'tablet-smartphone',
    },
    {
      title: 'Consultoría Digital',
      description: 'Estrategias digitales para crecimiento empresarial',
      icon: 'trending-up',
    },
  ],

  // Estadísticas de la empresa
  stats: {
    projects: '50+',
    satisfaction: '98%',
    responseTime: '2h',
    experience: '5+',
  },

  // Testimonios de clientes
  testimonials: [
    {
      name: 'María García',
      position: 'CEO, DigitalCorp',
      content: 'TechSolutions Pro transformó completamente nuestra presencia digital. El nuevo sitio web aumentó nuestras conversiones en un 150%.',
      rating: 5,
      avatar: '/rectangle.svg',
    },
    {
      name: 'Carlos Rodríguez',
      position: 'Fundador, StartupXYZ',
      content: 'Excelente trabajo en nuestra aplicación web. El equipo fue profesional, comunicativo y entregó el proyecto a tiempo.',
      rating: 5,
      avatar: '/rectangle.svg',
    },
    {
      name: 'Ana Martínez',
      position: 'Directora de Marketing, RetailPro',
      content: 'La consultoría digital que recibimos fue invaluable. Nuestras ventas online han crecido un 200% en solo 6 meses.',
      rating: 5,
      avatar: '/rectangle.svg',
    },
  ],

  // Proyectos destacados (corregidos con slug e imagen)
  featuredProjects: [
    {
      title: 'E-commerce Fashion',
      description: 'Tienda online completa con pasarela de pagos',
      category: 'E-commerce',
      technologies: ['React', 'Node.js', 'Stripe'],
      slug: 'e-commerce-fashion',
      image: '/rectangle.svg',
    },
    {
      title: 'Dashboard Empresarial',
      description: 'Sistema de gestión integral para empresas',
      category: 'Aplicación Web',
      technologies: ['Vue.js', 'Laravel', 'MySQL'],
      slug: 'dashboard-empresarial',
      image: '/rectangle.svg',
    },
    {
      title: 'Sitio Web Corporativo',
      description: 'Landing page moderna con SEO optimizado',
      category: 'Desarrollo Web',
      technologies: ['Astro', 'TailwindCSS', 'TypeScript'],
      slug: 'sitio-web-corporativo',
      image: '/rectangle.svg',
    },
  ],
};
export default siteConfig;

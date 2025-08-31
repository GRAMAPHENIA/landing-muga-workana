export const siteConfig = {
  name: 'muga',
  title: 'Desarrollo Web Profesional | Tu Empresa',
  description:
    'Desarrollo de sitios web y aplicaciones para empresas. Soluciones digitales profesionales.',
  url: 'https://tu-empresa.com',
  author: 'Tu Empresa',
  email: 'contacto@tu-empresa.com',
  phone: '+34 900 123 456',
  address: 'Tu Dirección, Tu Ciudad',

  // Redes sociales
  social: {
    linkedin: 'https://linkedin.com/company/tu-empresa',
    twitter: 'https://twitter.com/tu_empresa',
    github: 'https://github.com/tu-empresa',
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
    { name: 'Testimonios', href: '#testimonios' },
    { name: 'Contacto', href: '#contacto' },
  ],

  // Servicios principales (opcional - se puede usar en otros componentes)
  services: [
    {
      title: 'Desarrollo Web',
      description: 'Sitios web modernos y responsivos',
      icon: 'globe',
    },
    {
      title: 'E-commerce',
      description: 'Tiendas online completas',
      icon: 'shopping-cart',
    },
    {
      title: 'Aplicaciones Web',
      description: 'Sistemas web personalizados',
      icon: 'tablet-smartphone',
    },
  ],
};

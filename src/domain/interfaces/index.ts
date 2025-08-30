/**
 * Exportaciones centrales de interfaces de dominio
 * Evitamos archivos de barril según las reglas del proyecto
 */

// SEO y metadatos
export type { SEOConfig, MetaTag, PageSEO } from './seo.interface';

// Navegación
export type { 
  NavigationItem, 
  FooterSection, 
  FooterLink, 
  SocialLink, 
  BreadcrumbItem 
} from './navigation.interface';

// Componentes
export type { 
  ButtonProps, 
  InputProps, 
  InputValidation,
  CardProps, 
  CardImage, 
  CardSlots,
  LayoutProps, 
  HeaderProps, 
  FooterProps,
  LogoConfig 
} from './components.interface';

// Formularios
export type { 
  ContactForm, 
  FormValidation, 
  ValidationRule, 
  FormState, 
  FormConfig, 
  FormSubmissionResult, 
  FormFieldError,
  NewsletterForm,
  FormResponse 
} from './forms.interface';

// Configuración del sitio
export type { 
  SiteConfig, 
  FooterConfig, 
  VersionConfig, 
  PerformanceConfig, 
  VersionInfo, 
  ChangelogEntry 
} from './site.interface';
/**
 * Interfaces para componentes reutilizables
 * Requirement: 6.4 - Componentes reutilizables con props tipadas
 */

import type {
  FooterSection,
  SocialLink,
  NavigationItem,
} from './navigation.interface';

export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  text: string;
  href?: string;
  className?: string;
  ariaLabel?: string;
}

export interface InputProps {
  type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value?: string;
  className?: string;
  validation?: InputValidation;
  ariaDescribedBy?: string;
}

export interface InputValidation {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  customMessage?: string;
}

export interface CardProps {
  title?: string;
  subtitle?: string;
  content?: string;
  image?: CardImage;
  variant: 'default' | 'featured' | 'minimal';
  className?: string;
  href?: string;
  slots?: CardSlots;
}

export interface CardImage {
  src: string;
  alt: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

export interface CardSlots {
  header?: boolean;
  content?: boolean;
  footer?: boolean;
}

export interface LayoutProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
  className?: string;
}

export interface HeaderProps {
  navigation: NavigationItem[];
  logo: LogoConfig;
  mobileMenuEnabled?: boolean;
  className?: string;
}

export interface FooterProps {
  version?: string;
  links: FooterSection[];
  social: SocialLink[];
  showVersion?: boolean;
  copyright?: string;
  className?: string;
}

export interface LogoConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  href?: string;
}

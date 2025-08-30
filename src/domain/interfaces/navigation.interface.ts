/**
 * Interfaces para navegación y estructura del sitio
 * Requirement: 2.3 - Props bien definidas y tipadas
 */

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  ariaLabel?: string;
  children?: NavigationItem[];
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  ariaLabel?: string;
}

export interface SocialLink {
  platform: 'twitter' | 'facebook' | 'linkedin' | 'instagram' | 'github';
  url: string;
  ariaLabel?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

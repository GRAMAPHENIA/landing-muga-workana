/**
 * Interface principal para configuración del sitio
 * Requirement: 3.4 - Configuración central
 */

import type { SEOConfig } from './seo.interface';
import type { NavigationItem, FooterSection, SocialLink } from './navigation.interface';
import type { FormConfig } from './forms.interface';

export interface SiteConfig {
  metadata: SEOConfig;
  navigation: NavigationItem[];
  footer: FooterConfig;
  forms: FormConfig;
  version: VersionConfig;
  performance: PerformanceConfig;
  logo: LogoConfig;
}

export interface FooterConfig {
  copyright: string;
  links: FooterSection[];
  social: SocialLink[];
  showVersion: boolean;
}

export interface VersionConfig {
  changelogPath: string;
  displayFormat: "full" | "short" | "semantic";
  showInFooter: boolean;
  fallbackVersion: string;
}

export interface PerformanceConfig {
  enableImageOptimization: boolean;
  enableLazyLoading: boolean;
  criticalCSSInline: boolean;
  preloadFonts: string[];
}

export interface LogoConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  href?: string;
}

export interface VersionInfo {
  version: string;
  date: string;
  changes: string[];
}

export interface ChangelogEntry {
  version: string;
  date: string;
  type: "added" | "changed" | "deprecated" | "removed" | "fixed" | "security";
  description: string;
}
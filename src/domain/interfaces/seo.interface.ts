/**
 * Interfaces para configuración SEO y metadatos
 * Requirement: 3.4 - Metadatos configurables desde archivo central
 */

export interface SEOConfig {
  site: {
    title: string;
    description: string;
    url: string;
    author: string;
    keywords: string[];
    language: string;
  };
  openGraph: {
    title: string;
    description: string;
    image: string;
    type: "website";
    locale: string;
  };
  twitter: {
    card: "summary_large_image";
    site: string;
    creator: string;
    image: string;
  };
  structuredData?: {
    "@type": "Organization" | "WebSite";
    name: string;
    url: string;
    logo?: string;
  };
}

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

export interface PageSEO {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}
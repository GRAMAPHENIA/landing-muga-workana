/**
 * Entidades para manejo de SEO y metadatos
 * Requirement: 3.4 - Metadatos configurables
 */

import type { SEOConfig, PageSEO, MetaTag } from '../interfaces/seo.interface';

export class SEOManager {
  constructor(private config: SEOConfig) {}

  generateMetaTags(pageSEO?: Partial<PageSEO>): MetaTag[] {
    const title = pageSEO?.title || this.config.site.title;
    const description = pageSEO?.description || this.config.site.description;
    const keywords = pageSEO?.keywords || this.config.site.keywords;
    const ogImage = pageSEO?.ogImage || this.config.openGraph.image;

    const metaTags: MetaTag[] = [
      // Metadatos básicos
      { name: 'description', content: description },
      { name: 'keywords', content: keywords.join(', ') },
      { name: 'author', content: this.config.site.author },
      { name: 'language', content: this.config.site.language },
      
      // OpenGraph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: ogImage },
      { property: 'og:type', content: this.config.openGraph.type },
      { property: 'og:locale', content: this.config.openGraph.locale },
      { property: 'og:url', content: this.config.site.url },
      
      // Twitter Cards
      { name: 'twitter:card', content: this.config.twitter.card },
      { name: 'twitter:site', content: this.config.twitter.site },
      { name: 'twitter:creator', content: this.config.twitter.creator },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: this.config.twitter.image },
    ];

    // Canonical URL si se proporciona
    if (pageSEO?.canonical) {
      metaTags.push({ name: 'canonical', content: pageSEO.canonical });
    }

    return metaTags;
  }

  generateStructuredData(): string {
    if (!this.config.structuredData) {
      return '';
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": this.config.structuredData["@type"],
      "name": this.config.structuredData.name,
      "url": this.config.structuredData.url,
      ...(this.config.structuredData.logo && { "logo": this.config.structuredData.logo })
    };

    return JSON.stringify(structuredData);
  }

  generateTitle(pageTitle?: string): string {
    if (!pageTitle) {
      return this.config.site.title;
    }
    
    return `${pageTitle} | ${this.config.site.title}`;
  }
}
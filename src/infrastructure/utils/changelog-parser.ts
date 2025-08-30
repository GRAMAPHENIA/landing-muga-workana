/**
 * Utilidad para parsear el CHANGELOG.md y extraer la versión actual
 * Requirement: 4.1, 4.2 - Versionado automático en footer
 */

import { readFileSync } from 'fs';
import { join } from 'path';

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    added?: string[];
    changed?: string[];
    deprecated?: string[];
    removed?: string[];
    fixed?: string[];
    security?: string[];
  };
}

/**
 * Extrae la versión más reciente del CHANGELOG.md
 */
export function getCurrentVersion(changelogPath: string = 'CHANGELOG.md'): string {
  try {
    const changelogContent = readFileSync(join(process.cwd(), changelogPath), 'utf-8');
    
    // Buscar la primera línea que contenga una versión en formato [x.x.x]
    const versionMatch = changelogContent.match(/##\s*\[(\d+\.\d+\.\d+)\]/);
    
    if (versionMatch && versionMatch[1]) {
      return versionMatch[1];
    }
    
    // Fallback: buscar cualquier patrón de versión semántica
    const fallbackMatch = changelogContent.match(/(\d+\.\d+\.\d+)/);
    if (fallbackMatch && fallbackMatch[1]) {
      return fallbackMatch[1];
    }
    
    return '1.0.0'; // Versión por defecto
  } catch (error) {
    console.warn('Error al leer CHANGELOG.md:', error);
    return '1.0.0'; // Versión por defecto en caso de error
  }
}

/**
 * Parsea el CHANGELOG.md completo y devuelve todas las entradas
 */
export function parseChangelog(changelogPath: string = 'CHANGELOG.md'): ChangelogEntry[] {
  try {
    const changelogContent = readFileSync(join(process.cwd(), changelogPath), 'utf-8');
    const entries: ChangelogEntry[] = [];
    
    // Dividir por versiones (líneas que empiezan con ##)
    const versionSections = changelogContent.split(/^## /gm).slice(1);
    
    for (const section of versionSections) {
      const lines = section.split('\n');
      const headerLine = lines[0];
      
      // Extraer versión y fecha del header
      const versionMatch = headerLine.match(/\[(\d+\.\d+\.\d+)\]\s*-\s*(\d{4}-\d{2}-\d{2})/);
      if (!versionMatch) continue;
      
      const version = versionMatch[1];
      const date = versionMatch[2];
      
      const changes: ChangelogEntry['changes'] = {};
      let currentSection: keyof typeof changes | null = null;
      
      // Parsear cambios por sección
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('### ')) {
          const sectionName = line.replace('### ', '').toLowerCase();
          if (['added', 'changed', 'deprecated', 'removed', 'fixed', 'security'].includes(sectionName)) {
            currentSection = sectionName as keyof typeof changes;
            changes[currentSection] = [];
          }
        } else if (line.startsWith('- ') && currentSection) {
          const changeText = line.replace('- ', '').replace(/^\*\*([^*]+)\*\*:\s*/, '');
          changes[currentSection]!.push(changeText);
        }
      }
      
      entries.push({ version, date, changes });
    }
    
    return entries;
  } catch (error) {
    console.warn('Error al parsear CHANGELOG.md:', error);
    return [];
  }
}

/**
 * Formatea la versión según el formato especificado
 */
export function formatVersion(version: string, format: 'full' | 'short' | 'semantic' = 'short'): string {
  switch (format) {
    case 'full':
      return `Versión ${version}`;
    case 'semantic':
      return `v${version}`;
    case 'short':
    default:
      return version;
  }
}
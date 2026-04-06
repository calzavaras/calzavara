import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://laborium.ch',
  output: 'static',
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      serialize(item) {
        // Hauptseiten
        if (item.url === 'https://laborium.ch/') {
          item.priority = 1.0;
          item.lastmod = new Date('2026-03-15');
        }
        // Kern-Seiten
        else if (item.url === 'https://laborium.ch/loesungen' || item.url === 'https://laborium.ch/referenzen') {
          item.priority = 0.9;
          item.lastmod = new Date('2026-03-15');
        }
        // Individuelle Referenzseiten
        else if (item.url === 'https://laborium.ch/referenzen/ki-voice-agent') {
          item.priority = 0.85;
          item.lastmod = new Date('2026-03-20');
        }
        else if (item.url === 'https://laborium.ch/referenzen/dashboard-kantonsverwaltung') {
          item.priority = 0.85;
          item.lastmod = new Date('2026-03-20');
        }
        // Sekundärseiten
        else if (item.url === 'https://laborium.ch/ueber-uns' || item.url === 'https://laborium.ch/kontakt') {
          item.priority = 0.8;
          item.lastmod = new Date('2026-03-15');
        }
        // Rechtsseiten – mit tiefer Priorität in Sitemap (noindex via Meta-Tag, aber für Crawler auffindbar)
        else if (item.url === 'https://laborium.ch/impressum' || item.url === 'https://laborium.ch/datenschutz') {
          item.priority = 0.3;
          item.changefreq = 'yearly';
          item.lastmod = new Date('2026-03-21');
        }
        return item;
      },
      filter: (page) => !page.includes('/404'),
    }),
  ],
  prefetch: {
    prefetchAll: true,
  },
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.nigredo.ch',
  output: 'static',
  publicDir: './static',
  outDir: './public',
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      serialize(item) {
        const normalizedUrl = item.url !== 'https://www.nigredo.ch/' && item.url.endsWith('/')
          ? item.url.slice(0, -1)
          : item.url;
        // Hauptseiten
        if (normalizedUrl === 'https://www.nigredo.ch/') {
          item.priority = 1.0;
          item.lastmod = new Date('2026-05-03');
        }
        // Kern-Seiten
        else if (normalizedUrl === 'https://www.nigredo.ch/loesungen' || normalizedUrl === 'https://www.nigredo.ch/referenzen') {
          item.priority = 0.9;
          item.lastmod = new Date('2026-05-03');
        }
        // Individuelle Referenzseiten
        else if (normalizedUrl === 'https://www.nigredo.ch/referenzen/ki-voice-agent') {
          item.priority = 0.8;
          item.lastmod = new Date('2026-05-03');
        }
        else if (normalizedUrl === 'https://www.nigredo.ch/referenzen/dashboard-kantonsverwaltung') {
          item.priority = 0.8;
          item.lastmod = new Date('2026-05-03');
        }
        else if (normalizedUrl === 'https://www.nigredo.ch/referenzen/therapie-ost') {
          item.priority = 0.8;
          item.lastmod = new Date('2026-05-03');
        }
        // Sekundärseiten
        else if (normalizedUrl === 'https://www.nigredo.ch/ueber-uns') {
          item.priority = 0.8;
          item.lastmod = new Date('2026-05-03');
        }
        else if (normalizedUrl === 'https://www.nigredo.ch/kontakt') {
          item.priority = 0.8;
          item.lastmod = new Date('2026-05-03');
        }
        return item;
      },
      filter: (page) => !page.includes('/404') && !page.includes('/impressum') && !page.includes('/datenschutz'),
    }),
  ],
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});

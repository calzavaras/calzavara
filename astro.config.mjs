import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.nigredo.ch',
  output: 'static',
  publicDir: './static',
  outDir: './public',
  redirects: {
    '/website-fuer-praxen-und-dienstleister/': '/lokal-gefunden-werden/',
  },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      serialize(item) {
        const url = item.url;
        if (url === 'https://www.nigredo.ch/') {
          item.priority = 1.0;
          item.lastmod = new Date('2026-05-03');
        }
        else if (url === 'https://www.nigredo.ch/loesungen/' || url === 'https://www.nigredo.ch/referenzen/') {
          item.priority = 0.9;
          item.lastmod = new Date('2026-05-03');
        }
        else if (url === 'https://www.nigredo.ch/referenzen/ki-voice-agent/') {
          item.priority = 0.8;
          item.lastmod = new Date('2026-05-03');
        }
        else if (url === 'https://www.nigredo.ch/referenzen/dashboard-kantonsverwaltung/') {
          item.priority = 0.8;
          item.lastmod = new Date('2026-05-03');
        }
        else if (url === 'https://www.nigredo.ch/referenzen/therapie-ost/') {
          item.priority = 0.8;
          item.lastmod = new Date('2026-05-03');
        }
        else if (url === 'https://www.nigredo.ch/ueber-uns/') {
          item.priority = 0.8;
          item.lastmod = new Date('2026-05-03');
        }
        else if (url === 'https://www.nigredo.ch/kontakt/') {
          item.priority = 0.8;
          item.lastmod = new Date('2026-05-03');
        }
        else if ([
          'https://www.nigredo.ch/website-fuer-selbststaendige-kmu-und-vereine/',
          'https://www.nigredo.ch/lokal-gefunden-werden/',
          'https://www.nigredo.ch/technik-und-cms/',
          'https://www.nigredo.ch/haeufige-fragen-webdesign/',
        ].includes(url)) {
          item.priority = 0.75;
          item.lastmod = new Date('2026-05-05');
        }
        return item;
      },
      filter: (page) => !page.includes('/404') && !page.includes('/impressum') && !page.includes('/datenschutz'),
    }),
  ],
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  compressHTML: true,
});

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
        const url = item.url;
        if (url === 'https://www.nigredo.ch/') {
          item.priority = 1.0;
          item.lastmod = new Date('2026-05-03');
        }
        else if (url === 'https://www.nigredo.ch/digitale-loesungen/' || url === 'https://www.nigredo.ch/referenzen/') {
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
        else if (url === 'https://www.nigredo.ch/referenzen/thinktank/') {
          item.priority = 0.8;
          item.lastmod = new Date('2026-05-08');
        }
        else if (url === 'https://www.nigredo.ch/marco-calzavara/') {
          item.priority = 0.8;
          item.lastmod = new Date('2026-05-03');
        }
        else if (url === 'https://www.nigredo.ch/kontakt/') {
          item.priority = 0.8;
          item.lastmod = new Date('2026-05-03');
        }
        else if ([
          'https://www.nigredo.ch/website-fuer-kmu-selbststaendige/',
          'https://www.nigredo.ch/lokale-seo/',
          'https://www.nigredo.ch/website-technik-cms/',
        ].includes(url)) {
          item.priority = 0.75;
          item.lastmod = new Date('2026-05-05');
        }
        else if (url === 'https://www.nigredo.ch/faq-webdesign/') {
          item.priority = 0.75;
          item.lastmod = new Date('2026-05-06');
        }
        else if (url === 'https://www.nigredo.ch/impressum/' || url === 'https://www.nigredo.ch/datenschutz/') {
          item.priority = 0.3;
          item.changefreq = 'yearly';
          item.lastmod = new Date('2026-04-28');
        }
        return item;
      },
      filter: (page) => !page.includes('/404'),
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

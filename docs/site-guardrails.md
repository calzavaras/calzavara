# Site Guardrails

Diese Regeln sichern die technische Qualität der Website ab, ohne das sichtbare Design zu verändern.

## Build

- `npm run build` minifiziert zuerst `src/scripts/main.js` nach `static/main.min.js`.
- Danach baut Astro nach `public/`.
- Anschliessend validiert `scripts/validate-site.mjs` den generierten Output.
- Zum Schluss werden die CSP-Hashes in `.htaccess` aktualisiert.

## Automatisch geprüfte Regeln

- `html lang="de-CH"`
- moderner `viewport`
- `title`, `description`, `canonical`
- `hreflang="de-CH"` und `x-default`
- Open Graph und Twitter Cards
- genau eine `H1`
- JSON-LD vorhanden
- keine `SearchAction`, solange keine Suche existiert
- `img` mit `width`, `height` und `alt`
- Mobile-Menü mit `aria-label`, `aria-controls` und `aria-expanded`
- Trailing-Slash-Konsistenz in `llms.txt` und `llms-full.txt`

## Inhalte und Struktur

- Hauptseiten sollen visuell stabil bleiben.
- Unterseiten nutzen gemeinsame Hero- und CTA-Muster über `global.css`.
- Wiederkehrende Kartenstile laufen zentral über `.value-card`.

## Bei Änderungen

- Nach Anpassungen an `src/scripts/main.js` immer neu bauen, damit `static/main.min.js` synchron bleibt.
- Neue Seiten sollen die vorhandenen Layout- und Meta-Konventionen übernehmen.
- Neue Bild-Assets auf Dimensionen, `alt`-Text und passendes Ladeverhalten prüfen.

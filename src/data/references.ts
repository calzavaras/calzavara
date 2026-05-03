export const REFERENCES_INITIAL_VISIBLE = 2;
export const REFERENCES_PER_PAGE = 4;

const referenceEntries = [
  {
    href: '/referenzen/ki-voice-agent/',
    imgSrc: '/referenzen/ki-voice-agent/ki-voice-agent-ahv-hilfsmittel-sprachassistent.svg',
    imgAlt: 'KI Voice Agent für IV-Stellen - AHV Hilfsmittel Sprachassistent von Nigredo',
    listImgCls: 'ref-main-card-img--purple',
    moreImgCls: 'case-more-card-img--purple',
    badge: { text: 'KI-Agent', cls: 'accent-purple' },
    linkCls: 'ref-main-link--ki',
    year: 'Feb 2026',
    sortDate: '2026-02-01',
    listTitle: 'KI Agent für IV-Stellen',
    moreTitle: 'KI Voice Agent für IV-Stellen',
    sub: 'Sprachassistent für AHV-Hilfsmittel',
    listDesc: 'Ein Prototyp für Anfragen, die nicht warten sollten. Vier Sprachen, sofortige Antworten und Fachwissen, das zuverlässig verfügbar bleibt. Noch nicht im Einsatz, aber nah genug am Alltag gebaut, um zu zeigen, was möglich ist.',
    moreDesc: 'Beantwortet Anfragen zu AHV-Hilfsmitteln sofort, mehrsprachig und ohne Warteschleife.',
    ariaLabel: 'KI Agent für IV-Stellen - Details ansehen',
  },
  {
    href: '/referenzen/dashboard-kantonsverwaltung/',
    imgSrc: '/referenzen/dashboard-kantonsverwaltung/dashboard-kantonsverwaltung-excel-kpi-browser.svg',
    imgAlt: 'Dashboard für Verwaltung - Excel KPI-Auswertung im Browser ohne Cloud',
    listImgCls: 'ref-main-card-img--cyan',
    moreImgCls: 'case-more-card-img--cyan',
    badge: { text: 'App', cls: 'accent-cyan' },
    linkCls: '',
    year: 'Jun 2025',
    sortDate: '2025-06-01',
    listTitle: 'Dashboard für Verwaltung',
    moreTitle: 'Dashboard für Verwaltung',
    sub: 'Excel KPI-Auswertung im Browser, ohne Cloud',
    listDesc: 'Sensible Daten bleiben dort, wo sie hingehören: auf dem eigenen Rechner. Aus Excel wird mit einem Klick ein klarer Bericht. Ohne Cloud, ohne IT-Ticket, ohne den üblichen Umweg durch drei Abteilungen.',
    moreDesc: 'Wertet Excel-Daten lokal aus, anonymisiert sensible Angaben und erstellt klare Berichte.',
    ariaLabel: 'Dashboard für Verwaltung - Details ansehen',
  },
  {
    href: '/referenzen/therapie-ost/',
    imgSrc: '/referenzen/therapie-ost/therapie-ost-website-illustration.svg',
    imgAlt: 'Website für Therapie Ost - dunkle illustrativ nachgebaute Startseite',
    listImgCls: 'ref-main-card-img--coral',
    moreImgCls: 'case-more-card-img--coral',
    badge: { text: 'Website', cls: 'accent-coral' },
    linkCls: '',
    year: 'Apr 2026',
    sortDate: '2026-04-01',
    listTitle: 'Website für Therapie Ost',
    moreTitle: 'Website für Therapie Ost',
    sub: 'Praxisauftritt mit Vertrauen, Struktur und Online-Buchung',
    listDesc: 'Ein ruhiger Webauftritt für eine Praxis in St. Gallen: klare Positionierung, echte Bilder, mobile Sauberkeit und ein direkter Weg zur Terminbuchung. Nicht laut, aber wirksam.',
    moreDesc: 'Bringt Vertrauen, Klarheit und direkte Online-Terminbuchung in einen ruhigen Praxisauftritt.',
    ariaLabel: 'Website für Therapie Ost - Details ansehen',
  },
] as const;

export type ReferenceEntry = (typeof referenceEntries)[number];

export const references = [...referenceEntries].sort((a, b) => (
  new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime()
));

export function getReferencePageCount() {
  return Math.max(1, Math.ceil(references.length / REFERENCES_PER_PAGE));
}

export function getReferencePage(pageNumber: number) {
  const start = (pageNumber - 1) * REFERENCES_PER_PAGE;
  return references.slice(start, start + REFERENCES_PER_PAGE);
}

export function getReferencePageHref(pageNumber: number) {
  return pageNumber <= 1 ? '/referenzen/' : `/referenzen/seite/${pageNumber}/`;
}

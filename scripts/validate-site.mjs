import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(ROOT, 'public');
const STATIC_DIR = join(ROOT, 'static');

const errors = [];
const warnings = [];

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function validateHtml(html, relativePath) {
  const isRedirectStub = /http-equiv=["']refresh["']/i.test(html);

  if (isRedirectStub) {
    const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
    if (!canonical) {
      addError(`${relativePath}: redirect stub is missing canonical link`);
    }
    return;
  }

  const lang = html.match(/<html[^>]*lang="([^"]+)"/i)?.[1];
  if (lang !== 'de-CH') {
    addError(`${relativePath}: expected html lang="de-CH", got "${lang ?? 'missing'}"`);
  }

  const viewport = html.match(/<meta[^>]+name="viewport"[^>]+content="([^"]+)"/i)?.[1];
  if (!viewport || !viewport.includes('width=device-width')) {
    addError(`${relativePath}: missing modern viewport meta tag`);
  }

  const title = stripTags(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  if (!title) {
    addError(`${relativePath}: missing <title>`);
  }

  const description = html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)?.[1] ?? '';
  if (!description) {
    addError(`${relativePath}: missing meta description`);
  } else if (description.length < 70 || description.length > 160) {
    addWarning(`${relativePath}: meta description length ${description.length} is outside the ideal 70-160 range`);
  }

  const themeColor = html.match(/<meta[^>]+name="theme-color"[^>]+content="([^"]+)"/i)?.[1];
  if (!themeColor) {
    addError(`${relativePath}: missing theme-color meta`);
  }

  const colorScheme = html.match(/<meta[^>]+name="color-scheme"[^>]+content="([^"]+)"/i)?.[1];
  if (!colorScheme) {
    addError(`${relativePath}: missing color-scheme meta`);
  }

  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
  if (!canonical) {
    addError(`${relativePath}: missing canonical link`);
  } else if (canonical !== 'https://www.nigredo.ch/' && !canonical.endsWith('/')) {
    addError(`${relativePath}: canonical must end with a trailing slash (${canonical})`);
  }

  const hreflangDe = html.match(/<link[^>]+rel="alternate"[^>]+hreflang="de-CH"[^>]+href="([^"]+)"/i)?.[1];
  const hreflangDefault = html.match(/<link[^>]+rel="alternate"[^>]+hreflang="x-default"[^>]+href="([^"]+)"/i)?.[1];
  if (!hreflangDe || !hreflangDefault) {
    addError(`${relativePath}: missing hreflang alternates`);
  } else if (canonical && (hreflangDe !== canonical || hreflangDefault !== canonical)) {
    addError(`${relativePath}: hreflang URLs must match canonical`);
  }

  const ogTitle = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]*)"/i)?.[1] ?? '';
  const ogDescription = html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]*)"/i)?.[1] ?? '';
  const twitterCard = html.match(/<meta[^>]+name="twitter:card"[^>]+content="([^"]*)"/i)?.[1] ?? '';
  const twitterTitle = html.match(/<meta[^>]+name="twitter:title"[^>]+content="([^"]*)"/i)?.[1] ?? '';
  const twitterDescription = html.match(/<meta[^>]+name="twitter:description"[^>]+content="([^"]*)"/i)?.[1] ?? '';
  if (!ogTitle || !ogDescription) {
    addError(`${relativePath}: missing Open Graph title or description`);
  }
  if (!twitterCard || !twitterTitle || !twitterDescription) {
    addError(`${relativePath}: missing Twitter card metadata`);
  }

  const h1Count = [...html.matchAll(/<h1\b/gi)].length;
  if (h1Count !== 1) {
    addError(`${relativePath}: expected exactly one <h1>, found ${h1Count}`);
  }

  const jsonLdCount = [...html.matchAll(/<script[^>]+type="application\/ld\+json"/gi)].length;
  if (jsonLdCount === 0) {
    addError(`${relativePath}: missing JSON-LD`);
  }

  if (/SearchAction/i.test(html) || /urlTemplate":"https:\/\/www\.nigredo\.ch\/\?q=/.test(html)) {
    addError(`${relativePath}: SearchAction schema should not be present`);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    if (!/\bwidth="/i.test(tag) || !/\bheight="/i.test(tag)) {
      addError(`${relativePath}: image missing width/height -> ${tag.slice(0, 120)}`);
    }
    if (!/\balt="/i.test(tag)) {
      addError(`${relativePath}: image missing alt -> ${tag.slice(0, 120)}`);
    }
  }

  const menuButton = html.match(/<button[^>]+class="menu-toggle"[^>]*>/i)?.[0];
  if (!menuButton) {
    addError(`${relativePath}: missing mobile menu button`);
  } else {
    if (!/\baria-label="/i.test(menuButton)) {
      addError(`${relativePath}: menu button missing aria-label`);
    }
    if (!/\baria-controls="primary-navigation"/i.test(menuButton)) {
      addError(`${relativePath}: menu button missing aria-controls="primary-navigation"`);
    }
    if (!/\baria-expanded="false"/i.test(menuButton)) {
      addError(`${relativePath}: menu button missing default aria-expanded="false"`);
    }
  }
}

function validateTrailingSlashes(text, relativePath) {
  const urls = text.match(/https:\/\/www\.nigredo\.ch[^\s)"']+/g) ?? [];
  for (const url of urls) {
    if (
      url === 'https://www.nigredo.ch' ||
      url === 'https://www.nigredo.ch/' ||
      url.endsWith('.txt') ||
      url.endsWith('.xml') ||
      url.endsWith('.png') ||
      url.endsWith('.jpg') ||
      url.endsWith('.jpeg') ||
      url.endsWith('.webp') ||
      url.endsWith('.avif') ||
      url.endsWith('.svg')
    ) {
      continue;
    }

    if (!url.endsWith('/')) {
      addError(`${relativePath}: URL missing trailing slash -> ${url}`);
    }
  }
}

async function main() {
  for await (const file of walk(PUBLIC_DIR)) {
    if (!file.endsWith('.html')) continue;
    const html = await readFile(file, 'utf8');
    const relativePath = file.replace(`${ROOT}/`, '');
    validateHtml(html, relativePath);
  }

  for (const file of ['llms.txt', 'llms-full.txt']) {
    const fullPath = join(STATIC_DIR, file);
    const text = await readFile(fullPath, 'utf8');
    validateTrailingSlashes(text, `static/${file}`);
  }

  if (warnings.length > 0) {
    console.warn('Site validation warnings:');
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
  }

  if (errors.length > 0) {
    console.error('Site validation failed:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Site validation passed (${warnings.length} warning(s))`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

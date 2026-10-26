// Prerender static HTML for product and category pages after `vite build`.
// Runs as part of `npm run build`. Never fails the hosting build:
// if the API is unreachable we log a warning and exit 0 (no prerender, sitemap left untouched).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(FRONTEND_DIR, 'dist');

// API base: shell env first (Hostinger build env), then frontend/.env (parsed here —
// only VITE_API_URL is taken and nothing from the file is read into memory beyond that line),
// then the production default.
const resolveApiBase = async () => {
  if (process.env.VITE_API_URL) return process.env.VITE_API_URL;
  const envPath = path.join(FRONTEND_DIR, '.env');
  if (existsSync(envPath)) {
    try {
      const contents = await readFile(envPath, 'utf8');
      const line = contents
        .split(/\r?\n/)
        .find(l => l.trim().startsWith('VITE_API_URL='));
      if (line) {
        const value = line.slice('VITE_API_URL='.length).trim().replace(/^["']|["']$/g, '');
        if (value) return value;
      }
    } catch { /* unreadable .env — fall through to default */ }
  }
  return 'https://api.elmasry-electronics.com';
};

const SITE_URL = 'https://elmasry-electronics.com';
const API_BASE = await resolveApiBase().then(url => url.replace(/\/+$/, ''));
const FETCH_TIMEOUT_MS = 20_000;
const PAGE_SIZE = 500;
const MAX_PAGES = 100;

const warn = (...args) => console.warn('[prerender]', ...args);

// Mirrors src/utils/seoHelpers.js (kept inline so the build script never breaks if that file changes)
const formatCategoryName = (category) => {
  if (!category) return '';
  const mappings = {
    'كوفات': 'كوفات المصرى',
    'ليدات': 'ليدات المصرى',
    'تيكونات': 'تيكونات المصرى',
    'بورد': 'بورد المصرى',
    'مساطر شاشات': 'مساطر شاشات المصرى',
    'شاشات': 'شاشات المصرى'
  };
  return mappings[category] || category;
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const escapeJsonLd = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');

const cap = (text, max) => (text.length > max ? text.slice(0, max - 1) + '…' : text);

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchAllProducts() {
  const products = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const payload = await fetchJson(`${API_BASE}/api/product/active?page=${page}&limit=${PAGE_SIZE}`);
    if (!payload?.success || !Array.isArray(payload.data)) {
      throw new Error(`unexpected /api/product/active response (page ${page})`);
    }
    products.push(...payload.data);
    if (payload.data.length < PAGE_SIZE) break;
  }
  return products;
}

async function fetchCategories() {
  const payload = await fetchJson(`${API_BASE}/api/product/category/list`);
  if (!payload?.success || !Array.isArray(payload.data)) {
    throw new Error('unexpected /api/product/category/list response');
  }
  return payload.data;
}

// Original → NewCondition, Used → UsedCondition. "Substitute" has no clear schema.org
// mapping, so itemCondition is omitted for it.
const conditionToSchema = (condition) => {
  const value = (condition || '').toLowerCase();
  if (value === 'original') return 'https://schema.org/NewCondition';
  if (value === 'used') return 'https://schema.org/UsedCondition';
  return null;
};

const HEAD_STRIP_PATTERNS = [
  /<title>[\s\S]*?<\/title>/i,
  /<meta\s+name="description"[^>]*>/i,
  /<meta\s+name="robots"[^>]*>/i,
  /<link\s+rel="canonical"[^>]*>/i,
  /<meta\s+property="og:[^"]*"[^>]*>/gi,
  /<meta\s+name="twitter:[^"]*"[^>]*>/gi,
  /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi,
];

function injectHead(template, headTags) {
  let html = template;
  for (const pattern of HEAD_STRIP_PATTERNS) html = html.replace(pattern, '');
  return html.replace('</head>', `${headTags}\n  </head>`);
}

function injectRoot(html, fallbackHtml) {
  if (html.includes('<div id="root"></div>')) {
    return html.replace('<div id="root"></div>', `<div id="root">${fallbackHtml}</div>`);
  }
  warn('no empty <div id="root"></div> in template — injecting static content before the module script');
  return html.replace('<script type="module"', `${fallbackHtml}\n    <script type="module"`);
}

function productMeta(product) {
  const name = (product.name || '').trim();
  const code = (product.sku || product.mpn || '').trim();
  const compat = (product.compatible_models || '').trim();
  const price = Number(product.price) || 0;
  const image = Array.isArray(product.images) && product.images.length > 0
    && typeof product.images[0] === 'string' && product.images[0].startsWith('http')
    ? product.images[0]
    : `${SITE_URL}/logo.svg`;
  return { name, code, compat, price, image };
}

function buildProductPage(template, product) {
  const { name, code, compat, price, image } = productMeta(product);
  const url = `${SITE_URL}/product/${encodeURIComponent(product.id)}`;

  const title = cap(
    `${name}${code ? ` ${code}` : ''}${compat ? ` | متوافق مع ${compat}` : ''} | المصري للإلكترونيات`,
    120
  );
  const description = cap(
    `اشتري ${name}${code ? ` ${code}` : ''} بسعر ${price} ج.م من المصري للإلكترونيات.` +
    `${compat ? ` متوافق مع: ${compat}.` : ''} توصيل سريع لحد الورشة لجميع محافظات مصر.`,
    160
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    ...(code ? { sku: code } : {}),
    ...(product.mpn ? { mpn: product.mpn } : {}),
    image: [image],
    description,
    brand: { '@type': 'Brand', name: (product.brand || '').trim() || 'El-Masry Electronics' },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'EGP',
      price: String(price),
      availability: Number(product.stock) > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      ...(conditionToSchema(product.condition) ? { itemCondition: conditionToSchema(product.condition) } : {}),
    },
  };

  const headTags = [
    `    <title>${escapeHtml(title)}</title>`,
    `    <meta name="description" content="${escapeHtml(description)}" />`,
    `    <link rel="canonical" href="${url}" />`,
    `    <meta property="og:type" content="product" />`,
    `    <meta property="og:title" content="${escapeHtml(title)}" />`,
    `    <meta property="og:description" content="${escapeHtml(description)}" />`,
    `    <meta property="og:image" content="${escapeHtml(image)}" />`,
    `    <meta property="og:url" content="${url}" />`,
    `    <script type="application/ld+json">${escapeJsonLd(jsonLd)}</script>`,
  ].join('\n');

  const fallback = [
    '    <div dir="rtl" style="font-family:inherit;padding:24px;max-width:720px;margin:0 auto;">',
    `      <h1>${escapeHtml(name)}${code ? ` <small>(${escapeHtml(code)})</small>` : ''}</h1>`,
    `      <p style="font-size:1.5rem;font-weight:700;">${price} ج.م</p>`,
    compat ? `      <p>متوافق مع / Compatible with: ${escapeHtml(compat)}</p>` : '',
    `      <p><a href="${url}">افتح الصفحة الكاملة على المصري للإلكترونيات</a></p>`,
    '    </div>',
  ].filter(Boolean).join('\n');

  return injectRoot(injectHead(template, headTags), fallback);
}

function buildCategoryPage(template, category, products) {
  const slug = (category.slug || '').trim();
  const rawName = (category.nameAr || category.nameEn || slug).trim();
  const name = formatCategoryName(rawName);
  const url = `${SITE_URL}/category/${encodeURIComponent(slug)}`;

  const title = cap(`${name} | المصري إلكترونيكس`, 120);
  const description = cap(
    `تصفح ${name} — قطع غيار أصلية للشاشات والكاميرات بأفضل الأسعار في مصر مع توصيل سريع. المصري إلكترونيكس.`,
    160
  );

  const headTags = [
    `    <title>${escapeHtml(title)}</title>`,
    `    <meta name="description" content="${escapeHtml(description)}" />`,
    `    <link rel="canonical" href="${url}" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:title" content="${escapeHtml(title)}" />`,
    `    <meta property="og:description" content="${escapeHtml(description)}" />`,
    `    <meta property="og:url" content="${url}" />`,
  ].join('\n');

  const items = products
    .filter(p => (p.category || '').trim() === rawName)
    .slice(0, 50)
    .map(p => {
      const meta = productMeta(p);
      return `      <li><a href="${SITE_URL}/product/${encodeURIComponent(p.id)}">${escapeHtml(meta.name)}${meta.code ? ` (${escapeHtml(meta.code)})` : ''}</a></li>`;
    })
    .join('\n');

  const fallback = [
    '    <div dir="rtl" style="font-family:inherit;padding:24px;max-width:720px;margin:0 auto;">',
    `      <h1>${escapeHtml(name)}</h1>`,
    items ? `      <ul>\n${items}\n      </ul>` : '',
    `      <p><a href="${url}">افتح صفحة ${escapeHtml(name)} الكاملة</a></p>`,
    '    </div>',
  ].filter(Boolean).join('\n');

  return injectRoot(injectHead(template, headTags), fallback);
}

function buildSitemap(categories, products) {
  const today = new Date().toISOString().slice(0, 10);
  const entries = [
    { loc: `${SITE_URL}/`, lastmod: today, priority: '1.0' },
    ...categories.map(c => ({
      loc: `${SITE_URL}/category/${encodeURIComponent((c.slug || '').trim())}`,
      lastmod: today,
      priority: '0.8',
    })),
    ...products.map(p => ({
      loc: `${SITE_URL}/product/${encodeURIComponent(p.id)}`,
      lastmod: (p.updatedAt || p.createdAt || today).slice(0, 10),
      priority: '0.7',
    })),
  ];

  const body = entries.map(e => [
    '  <url>',
    `    <loc>${e.loc}</loc>`,
    `    <lastmod>${e.lastmod}</lastmod>`,
    '    <changefreq>weekly</changefreq>',
    `    <priority>${e.priority}</priority>`,
    '  </url>',
  ].join('\n')).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

async function main() {
  console.log(`[prerender] started (API: ${API_BASE})`);
  // Safety net: if undici keep-alive sockets hold the event loop open after we finish,
  // still terminate the build with code 0. Must stay well above FETCH_TIMEOUT_MS so it
  // never kills a slow in-flight fetch.
  setTimeout(() => process.exit(0), 120_000).unref();

  const templatePath = path.join(DIST_DIR, 'index.html');
  if (!existsSync(templatePath)) {
    warn('dist/index.html not found — skipping prerender');
    return;
  }
  const template = await readFile(templatePath, 'utf8');

  let products = [];
  let categories = [];
  try {
    [products, categories] = await Promise.all([fetchAllProducts(), fetchCategories()]);
  } catch (error) {
    warn(`API fetch failed (${error.message}) — skipping prerender and sitemap generation`);
    return;
  }

  if (products.length === 0) {
    warn('API returned zero active products — skipping prerender and sitemap generation');
    return;
  }

  // Pagination can yield duplicate rows when the dataset shifts between page fetches — dedupe by id
  const seenIds = new Set();
  products = products.filter(p => {
    if (!p?.id || seenIds.has(String(p.id))) return false;
    seenIds.add(String(p.id));
    return true;
  });

  for (const product of products) {
    if (!product?.id) continue;
    const dir = path.join(DIST_DIR, 'product', encodeURIComponent(String(product.id)));
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), buildProductPage(template, product), 'utf8');
  }

  for (const category of categories) {
    if (!category?.slug) continue;
    const dir = path.join(DIST_DIR, 'category', encodeURIComponent(String(category.slug)));
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), buildCategoryPage(template, category, products), 'utf8');
  }

  await writeFile(path.join(DIST_DIR, 'sitemap.xml'), buildSitemap(categories, products), 'utf8');

  console.log(`[prerender] done: ${products.length} product pages, ${categories.length} category pages, sitemap.xml`);
}

main().catch((error) => {
  warn(`unexpected error: ${error?.message || error} — skipping prerender`);
});

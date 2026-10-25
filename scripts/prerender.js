import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "contentful";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");
const publicDir = path.resolve(__dirname, "../public");

if (!fs.existsSync(distDir)) {
  console.error("dist directory not found. Run vite build first.");
  process.exit(1);
}

const baseHtml = fs.readFileSync(path.join(distDir, "index.html"), "utf8");

// Load .env variables if not present in process.env
function loadEnv() {
  const envFiles = [".env.production", ".env.local", ".env"];
  for (const file of envFiles) {
    const fullPath = path.resolve(__dirname, `../${file}`);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim();
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    }
  }
}

loadEnv();

const sections = [
  {
    path: "beauty",
    heading: "Beauty",
    activeId: "beauty",
    description: "Explore beauty and editorial makeup by Prague-based artist Hristina Georgievska. Clean skin, bold artistry, and precision hair styling.",
    gridHtml: `
      <section>
        <h2 class="md:hidden font-serif text-2xl uppercase tracking-widest text-foreground text-center pt-6 pb-2">Beauty</h2>
        <h2 class="sr-only">Beauty Portfolio</h2>
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-8">
          <div class="aspect-[3/4] rounded-xl bg-muted/30"></div>
          <div class="aspect-[3/4] rounded-xl bg-muted/30"></div>
          <div class="aspect-[3/4] rounded-xl bg-muted/30"></div>
          <div class="aspect-[3/4] rounded-xl bg-muted/30"></div>
          <div class="aspect-[3/4] rounded-xl bg-muted/30"></div>
          <div class="aspect-[3/4] rounded-xl bg-muted/30"></div>
        </div>
      </section>
    `,
  },
  {
    path: "video",
    heading: "Video",
    activeId: "video",
    description: "Commercial, music, and fashion video productions featuring makeup and hair styling by Prague-based artist Hristina Georgievska.",
    gridHtml: `
      <section id="video-section" class="pt-8 pb-16 px-4 md:py-16 md:px-8">
        <h2 class="md:hidden font-serif text-2xl uppercase tracking-widest text-foreground text-center pb-6">Video</h2>
        <h2 class="sr-only">Video Portfolio</h2>
        <div class="max-w-5xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-[44px]">
            <div class="aspect-video rounded-xl bg-muted/30"></div>
            <div class="aspect-video rounded-xl bg-muted/30"></div>
            <div class="aspect-video rounded-xl bg-muted/30"></div>
            <div class="aspect-video rounded-xl bg-muted/30"></div>
          </div>
        </div>
      </section>
    `,
  },
  {
    path: "contact",
    heading: "Contact",
    activeId: "contact",
    description: "Get in touch with Prague-based make-up artist and hair stylist Hristina Georgievska for fashion, editorial, and commercial bookings.",
    gridHtml: `
      <section class="max-w-xl mx-auto px-4 pt-20 sm:pt-24 md:pt-28 pb-32 md:pb-44 text-center">
        <h2 class="sr-only">Contact &amp; Booking Information</h2>
        <div class="h-9 w-72 sm:w-80 max-w-full mx-auto rounded bg-muted/30 animate-pulse"></div>
        <div class="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div class="h-5 w-44 rounded bg-muted/30 animate-pulse"></div>
          <div class="h-5 w-36 rounded bg-muted/30 animate-pulse"></div>
        </div>
        <div class="mt-12 sm:mt-16 pt-8 border-t border-border/40 w-full max-w-lg mx-auto">
          <p class="text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium mb-3">
            Selected Editorial &amp; Commercial Features
          </p>
          <p class="text-sm text-foreground/80 font-light leading-relaxed tracking-wide">
            Vogue &bull; Elle &bull; Harper&apos;s Bazaar &bull; Marie Claire &bull; Vanity Fair Italia &bull; Dolcevita
          </p>
          <p class="mt-3 text-xs text-muted-foreground/80 font-light leading-relaxed max-w-md mx-auto">
            Based in Prague with 20+ years of international experience in fashion, editorial, advertising, and video productions.
          </p>
        </div>
      </section>
    `,
  },
];

function generateNav(activeId) {
  const items = [
    { id: "fashion", label: "Fashion", path: "/" },
    { id: "beauty", label: "Beauty", path: "/beauty" },
    { id: "video", label: "Video", path: "/video" },
    { id: "contact", label: "Contact", path: "/contact" },
  ];

  const listItems = items
    .map((item) => {
      const isActive = item.id === activeId;
      const cls = isActive
        ? "group relative inline-block py-1 text-sm uppercase tracking-[0.1em] text-foreground font-medium transition-colors duration-200"
        : "group relative inline-block py-1 text-sm uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors duration-200";
      const underlineClass = isActive
        ? "scale-x-100 opacity-100"
        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100";
      const underline = `<span class="absolute bottom-0 left-0 right-[0.1em] h-[1px] bg-foreground transition-all duration-300 ease-out origin-left ${underlineClass}"></span>`;
      return `<li><a href="${item.path}" class="${cls}">${item.label}${underline}</a></li>`;
    })
    .join("\n            ");

  return `
        <nav class="flex justify-center py-3 md:py-6">
          <ul class="hidden md:flex gap-10">
            ${listItems}
          </ul>
          <div class="md:hidden p-2 text-foreground relative z-[60]" aria-label="Menu">
            <div class="relative w-6 h-6">
              <span class="absolute left-0 block h-0.5 w-6 bg-foreground top-1"></span>
              <span class="absolute left-0 top-3 block h-0.5 w-6 bg-foreground opacity-100"></span>
              <span class="absolute left-0 block h-0.5 w-6 bg-foreground top-5"></span>
            </div>
          </div>
        </nav>
  `.trim();
}

const subpageHeaderHtml = `
        <header class="pt-8 pb-3 md:pt-12 md:pb-6 text-center">
          <div class="font-serif text-3xl md:text-4xl tracking-widest text-foreground min-h-[1.25em] leading-tight">
            <a href="/" class="hover:opacity-90 transition-opacity">
              HRISTINA <span class="font-bold">GEORGIEVSKA</span>
            </a>
          </div>
          <p class="mt-2 text-sm tracking-[0.3em] text-muted-foreground uppercase">
            Makeup Artist
          </p>
        </header>
`.trim();

// ---------------------------------------------------------------------------
// 1. Pre-render Core Section Pages (/beauty, /video, /contact)
// ---------------------------------------------------------------------------
for (const section of sections) {
  const sectionDir = path.join(distDir, section.path);
  if (!fs.existsSync(sectionDir)) {
    fs.mkdirSync(sectionDir, { recursive: true });
  }

  let html = baseHtml;

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="https:\/\/www\.hristinageorgievska\.com" \/>/,
    `<link rel="canonical" href="https://www.hristinageorgievska.com/${section.path}" />`
  );

  // Replace og:url
  html = html.replace(
    /<meta property="og:url" content="https:\/\/www\.hristinageorgievska\.com" \/>/,
    `<meta property="og:url" content="https://www.hristinageorgievska.com/${section.path}" />`
  );

  // Strip fashion hero image preload from non-fashion sections
  html = html.replace(/<link\s+rel="preload"\s+as="image"[^>]*>\s*/gi, "");

  // Replace title & OG title
  const pageTitle = `${section.heading} | Hristina Georgievska | Make-up Artist & Hair Stylist`;
  html = html.replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`);
  html = html.replace(
    /<meta property="og:title" content=".*?" \/>/,
    `<meta property="og:title" content="${pageTitle}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content=".*?" \/>/,
    `<meta name="twitter:title" content="${pageTitle}" />`
  );

  // Replace descriptions if section has custom one
  if (section.description) {
    html = html.replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${section.description}" />`
    );
    html = html.replace(
      /<meta property="og:description" content=".*?" \/>/,
      `<meta property="og:description" content="${section.description}" />`
    );
    html = html.replace(
      /<meta name="twitter:description" content=".*?" \/>/,
      `<meta name="twitter:description" content="${section.description}" />`
    );
  }

  // Replace nav
  html = html.replace(
    /<nav class="flex justify-center py-3 md:py-6">[\s\S]*?<\/nav>/,
    generateNav(section.activeId)
  );

  // Replace main content
  html = html.replace(
    /<main[\s\S]*?<\/main>/,
    `<main class="min-h-[75vh]">${section.gridHtml}</main>`
  );

  fs.writeFileSync(path.join(sectionDir, "index.html"), html, "utf8");
  console.log(`Pre-rendered section: /${section.path}/index.html`);
}

// ---------------------------------------------------------------------------
// 2. Fetch Collections from Contentful & Pre-render /collection/:slug Pages
// ---------------------------------------------------------------------------
async function fetchCollections() {
  const space = process.env.VITE_CONTENTFUL_SPACE_ID;
  const accessToken = process.env.VITE_CONTENTFUL_ACCESS_TOKEN;

  if (!space || !accessToken) {
    console.warn("Contentful credentials not found in env. Skipping collection pre-rendering.");
    return [];
  }

  try {
    const client = createClient({ space, accessToken });
    const response = await client.getEntries({
      content_type: "photoCollection",
      limit: 1000,
    });

    return response.items.map((item) => {
      const coverUrl = item.fields.coverImage?.fields?.file?.url
        ? `https:${item.fields.coverImage.fields.file.url}`
        : null;

      return {
        slug: item.fields.slug,
        title: item.fields.title || "Portfolio Collection",
        category: item.fields.category || "fashion",
        client: item.fields.client || null,
        photographer: item.fields.photographer || null,
        description: item.fields.description || null,
        coverUrl,
        updatedAt: item.sys.updatedAt ? item.sys.updatedAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
      };
    });
  } catch (error) {
    console.warn(`Failed to fetch collections from Contentful: ${error.message}`);
    return [];
  }
}

const collections = await fetchCollections();

if (collections.length > 0) {
  const collectionsBaseDir = path.join(distDir, "collection");
  if (!fs.existsSync(collectionsBaseDir)) {
    fs.mkdirSync(collectionsBaseDir, { recursive: true });
  }

  for (const col of collections) {
    if (!col.slug) continue;

    const colDir = path.join(collectionsBaseDir, col.slug);
    if (!fs.existsSync(colDir)) {
      fs.mkdirSync(colDir, { recursive: true });
    }

    let html = baseHtml;
    const colUrl = `https://www.hristinageorgievska.com/collection/${col.slug}`;
    const colTitle = `${col.title} | Makeup & Hair by Hristina Georgievska`;
    const colDesc =
      col.description ||
      (col.client
        ? `${col.title} for ${col.client} gallery. Makeup and hair styling by Prague-based artist Hristina Georgievska.`
        : `View the ${col.title} gallery. Makeup and hair styling by Prague-based artist Hristina Georgievska.`);

    // Self-referencing canonical tag
    html = html.replace(
      /<link rel="canonical" href="https:\/\/www\.hristinageorgievska\.com" \/>/,
      `<link rel="canonical" href="${colUrl}" />`
    );

    // og:url
    html = html.replace(
      /<meta property="og:url" content="https:\/\/www\.hristinageorgievska\.com" \/>/,
      `<meta property="og:url" content="${colUrl}" />`
    );

    // og:title & twitter:title & <title>
    html = html.replace(/<title>.*?<\/title>/, `<title>${colTitle}</title>`);
    html = html.replace(
      /<meta property="og:title" content=".*?" \/>/,
      `<meta property="og:title" content="${colTitle}" />`
    );
    html = html.replace(
      /<meta name="twitter:title" content=".*?" \/>/,
      `<meta name="twitter:title" content="${colTitle}" />`
    );

    // Meta descriptions
    html = html.replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${colDesc}" />`
    );
    html = html.replace(
      /<meta property="og:description" content=".*?" \/>/,
      `<meta property="og:description" content="${colDesc}" />`
    );
    html = html.replace(
      /<meta name="twitter:description" content=".*?" \/>/,
      `<meta name="twitter:description" content="${colDesc}" />`
    );

    // Social preview image if available
    if (col.coverUrl) {
      html = html.replace(
        /<meta property="og:image" content="https:\/\/www\.hristinageorgievska\.com\/og-image\.jpg" \/>/,
        `<meta property="og:image" content="${col.coverUrl}" />`
      );
      html = html.replace(
        /<meta name="twitter:image" content="https:\/\/www\.hristinageorgievska\.com\/og-image\.jpg" \/>/,
        `<meta name="twitter:image" content="${col.coverUrl}" />`
      );
    }

    // Strip fashion hero image preload
    html = html.replace(/<link\s+rel="preload"\s+as="image"[^>]*>\s*/gi, "");

    // In collections, header should not be an <h1> to avoid duplicate H1s with the collection title
    html = html.replace(
      /<header class="pt-8 pb-3 md:pt-12 md:pb-6 text-center">[\s\S]*?<\/header>/,
      subpageHeaderHtml
    );

    // Default nav
    html = html.replace(
      /<nav class="flex justify-center py-3 md:py-6">[\s\S]*?<\/nav>/,
      generateNav("")
    );

    // Server-rendered header and skeleton grid
    const mainContent = `
      <main class="min-h-[75vh]">
        <div class="max-w-5xl mx-auto px-4 pt-4 pb-2">
          <a href="/" class="inline-flex items-center gap-2 text-sm tracking-wider text-muted-foreground hover:text-foreground">
            &larr; Back
          </a>
        </div>
        <div class="max-w-5xl mx-auto px-4 pb-8">
          ${col.client ? `<p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">${col.client}</p>` : ""}
          <h1 class="font-serif text-2xl md:text-3xl tracking-wider text-foreground">${col.title}</h1>
          ${col.photographer ? `<p class="text-sm text-muted-foreground mt-1">Photo: ${col.photographer}</p>` : ""}
          ${col.description ? `<p class="text-muted-foreground mt-3 leading-relaxed max-w-2xl">${col.description}</p>` : ""}
        </div>
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-16">
          <div class="aspect-[3/4] rounded-xl bg-muted/30"></div>
          <div class="aspect-[3/4] rounded-xl bg-muted/30"></div>
          <div class="aspect-[3/4] rounded-xl bg-muted/30"></div>
          <div class="aspect-[3/4] rounded-xl bg-muted/30"></div>
          <div class="aspect-[3/4] rounded-xl bg-muted/30"></div>
          <div class="aspect-[3/4] rounded-xl bg-muted/30"></div>
        </div>
      </main>
    `.trim();

    html = html.replace(/<main[\s\S]*?<\/main>/, mainContent);

    // Inject BreadcrumbList Schema.org JSON-LD into <head>
    const categoryName = col.category
      ? col.category.charAt(0).toUpperCase() + col.category.slice(1)
      : "Portfolio";
    const categoryPath = col.category === "fashion" ? "" : `/${col.category || ""}`;

    const breadcrumbJson = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.hristinageorgievska.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: categoryName,
          item: `https://www.hristinageorgievska.com${categoryPath}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: col.title,
          item: colUrl,
        },
      ],
    });

    html = html.replace(
      /<\/head>/,
      `    <script type="application/ld+json">\n      ${breadcrumbJson}\n    </script>\n  </head>`
    );

    fs.writeFileSync(path.join(colDir, "index.html"), html, "utf8");
  }

  console.log(`Pre-rendered ${collections.length} collection pages under /collection/*/index.html`);
}

// ---------------------------------------------------------------------------
// 3. Generate Complete, Automated sitemap.xml
// ---------------------------------------------------------------------------
function generateSitemapXml(allCollections) {
  const today = new Date().toISOString().slice(0, 10);

  const corePages = [
    { loc: "https://www.hristinageorgievska.com/", priority: "1.0", changefreq: "monthly", lastmod: today },
    { loc: "https://www.hristinageorgievska.com/beauty", priority: "0.9", changefreq: "monthly", lastmod: today },
    { loc: "https://www.hristinageorgievska.com/video", priority: "0.9", changefreq: "monthly", lastmod: today },
    { loc: "https://www.hristinageorgievska.com/contact", priority: "0.9", changefreq: "monthly", lastmod: today },
  ];

  const collectionPages = allCollections.map((col) => ({
    loc: `https://www.hristinageorgievska.com/collection/${col.slug}`,
    priority: "0.8",
    changefreq: "monthly",
    lastmod: col.updatedAt || today,
  }));

  const allEntries = [...corePages, ...collectionPages];

  const entriesXml = allEntries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entriesXml}
</urlset>
`;
}

const sitemapXml = generateSitemapXml(collections);
fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemapXml, "utf8");
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXml, "utf8");
console.log(`Automated sitemap.xml updated with ${4 + collections.length} URLs (written to dist and public).`);

// ---------------------------------------------------------------------------
// 4. Pre-render Static 404.html (for Vercel HTTP 404 status & crawlers)
// ---------------------------------------------------------------------------
let notFoundHtml = baseHtml;

const notFoundTitle = "Page Not Found | Hristina Georgievska";
const notFoundDesc =
  "The page you are looking for has been moved, renamed, or does not exist. Explore the makeup and hair portfolio by Prague-based artist Hristina Georgievska.";

notFoundHtml = notFoundHtml.replace(/<title>.*?<\/title>/, `<title>${notFoundTitle}</title>`);
notFoundHtml = notFoundHtml.replace(
  /<meta property="og:title" content=".*?" \/>/,
  `<meta property="og:title" content="${notFoundTitle}" />`
);
notFoundHtml = notFoundHtml.replace(
  /<meta name="twitter:title" content=".*?" \/>/,
  `<meta name="twitter:title" content="${notFoundTitle}" />`
);

notFoundHtml = notFoundHtml.replace(
  /<meta name="description" content=".*?" \/>/,
  `<meta name="description" content="${notFoundDesc}" />`
);
notFoundHtml = notFoundHtml.replace(
  /<meta property="og:description" content=".*?" \/>/,
  `<meta property="og:description" content="${notFoundDesc}" />`
);
notFoundHtml = notFoundHtml.replace(
  /<meta name="twitter:description" content=".*?" \/>/,
  `<meta name="twitter:description" content="${notFoundDesc}" />`
);

// Add robots noindex, nofollow tag
notFoundHtml = notFoundHtml.replace(
  /<head>/,
  '<head>\n    <meta name="robots" content="noindex, nofollow" />'
);

// Remove canonical tag from 404 page so it does not falsely claim a canonical URL
notFoundHtml = notFoundHtml.replace(/<link rel="canonical"[^>]*>\s*/gi, "");

// Strip fashion hero image preload
notFoundHtml = notFoundHtml.replace(/<link\s+rel="preload"\s+as="image"[^>]*>\s*/gi, "");

// Default nav
notFoundHtml = notFoundHtml.replace(
  /<nav class="flex justify-center py-3 md:py-6">[\s\S]*?<\/nav>/,
  generateNav("")
);

// Header without h1 for 404 page (h1 is reserved for "Page Not Found")
notFoundHtml = notFoundHtml.replace(
  /<header class="pt-8 pb-3 md:pt-12 md:pb-6 text-center">[\s\S]*?<\/header>/,
  subpageHeaderHtml
);

// Main content
const notFoundMain = `
      <main class="max-w-xl mx-auto px-4 pt-16 pb-24 text-center">
        <p class="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-3">
          Error 404
        </p>
        <h1 class="font-serif text-3xl sm:text-4xl md:text-5xl tracking-wider text-foreground mb-4">
          Page Not Found
        </h1>
        <p class="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8 font-light">
          The page you are looking for has been moved, renamed, or does not exist.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/"
            class="inline-flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium text-foreground border border-foreground/30 hover:border-foreground transition-all duration-300 rounded-sm"
          >
            &larr; Return to Portfolio
          </a>
        </div>
      </main>
`.trim();

notFoundHtml = notFoundHtml.replace(/<main[\s\S]*?<\/main>/, notFoundMain);

fs.writeFileSync(path.join(distDir, "404.html"), notFoundHtml, "utf8");
fs.writeFileSync(path.join(publicDir, "404.html"), notFoundHtml, "utf8");
console.log("Pre-rendered static 404.html (written to dist and public).");

// ---------------------------------------------------------------------------
// 5. Synchronize llms.txt & robots.txt to dist
// ---------------------------------------------------------------------------
if (fs.existsSync(path.join(publicDir, "llms.txt"))) {
  fs.copyFileSync(path.join(publicDir, "llms.txt"), path.join(distDir, "llms.txt"));
  console.log("Synchronized llms.txt to dist/llms.txt");
}
if (fs.existsSync(path.join(publicDir, "robots.txt"))) {
  fs.copyFileSync(path.join(publicDir, "robots.txt"), path.join(distDir, "robots.txt"));
  console.log("Synchronized robots.txt to dist/robots.txt");
}


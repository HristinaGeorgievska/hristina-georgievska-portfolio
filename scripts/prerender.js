import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");

if (!fs.existsSync(distDir)) {
  console.error("dist directory not found. Run vite build first.");
  process.exit(1);
}

const baseHtml = fs.readFileSync(path.join(distDir, "index.html"), "utf8");

const sections = [
  {
    path: "beauty",
    heading: "Beauty",
    activeId: "beauty",
    gridHtml: `
      <section>
        <h2 class="md:hidden font-serif text-2xl uppercase tracking-widest text-foreground text-center pt-6 pb-2">Beauty</h2>
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
    gridHtml: `
      <section class="max-w-xl mx-auto px-4 pt-20 sm:pt-24 md:pt-28 pb-32 md:pb-44 text-center">
        <div class="h-9 w-72 sm:w-80 max-w-full mx-auto rounded bg-muted/30 animate-pulse"></div>
        <div class="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div class="h-5 w-44 rounded bg-muted/30 animate-pulse"></div>
          <div class="h-5 w-36 rounded bg-muted/30 animate-pulse"></div>
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

for (const section of sections) {
  const sectionDir = path.join(distDir, section.path);
  if (!fs.existsSync(sectionDir)) {
    fs.mkdirSync(sectionDir, { recursive: true });
  }

  // Replace active nav item, title, canonical link, and main content
  let html = baseHtml;

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="https:\/\/hristinageorgievska\.com" \/>/,
    `<link rel="canonical" href="https://hristinageorgievska.com/${section.path}" />`
  );

  // Replace title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${section.heading} | Hristina Georgievska | Make-up Artist & Hair Stylist</title>`
  );

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
  console.log(`Pre-rendered: /${section.path}/index.html`);
}

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

function loadEnvFile(envPath = path.resolve(process.cwd(), '.env')) {
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

export function encodeSitemapPathSegment(slug) {
  return encodeURIComponent(String(slug));
}

async function generateSitemap() {
  try {
    loadEnvFile();

    const SPACE_ID = process.env.VITE_CONTENTFUL_SPACE_ID;
    const ACCESS_TOKEN = process.env.VITE_CONTENTFUL_ACCESS_TOKEN;

    const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}&content_type=photoCollection`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Contentful data: ${response.statusText}`);
    }
    
    const data = await response.json();
    const items = data.items || [];
    
    const slugs = items
      .map((item) => item.fields.slug)
      .filter(Boolean);

    const baseUrl = 'https://www.hristinageorgievska.com';
    const currentDate = new Date().toISOString().split('T')[0];

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // Add homepage
    sitemapXml += `  <url>\n`;
    sitemapXml += `    <loc>${baseUrl}/</loc>\n`;
    sitemapXml += `    <lastmod>${currentDate}</lastmod>\n`;
    sitemapXml += `    <changefreq>monthly</changefreq>\n`;
    sitemapXml += `    <priority>1.0</priority>\n`;
    sitemapXml += `  </url>\n`;

    // Add collection pages
    slugs.forEach((slug) => {
      sitemapXml += `  <url>\n`;
      sitemapXml += `    <loc>${baseUrl}/collection/${encodeSitemapPathSegment(slug)}</loc>\n`;
      sitemapXml += `    <lastmod>${currentDate}</lastmod>\n`;
      sitemapXml += `    <changefreq>monthly</changefreq>\n`;
      sitemapXml += `    <priority>0.8</priority>\n`;
      sitemapXml += `  </url>\n`;
    });

    sitemapXml += `</urlset>\n`;

    const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');

    console.log(`Successfully generated sitemap with ${slugs.length + 1} URLs at ${sitemapPath}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateSitemap();
}

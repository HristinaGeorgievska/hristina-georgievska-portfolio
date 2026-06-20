import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const SPACE_ID = process.env.VITE_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.VITE_CONTENTFUL_ACCESS_TOKEN;

async function generateSitemap() {
  try {
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

    const baseUrl = 'https://hristinageorgievska.com';
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
      sitemapXml += `    <loc>${baseUrl}/collection/${slug}</loc>\n`;
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

generateSitemap();

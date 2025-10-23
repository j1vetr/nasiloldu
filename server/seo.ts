// SEO utilities - sitemap, robots.txt
import { storage } from "./storage";

export async function generateSitemap(): Promise<string> {
  const baseUrl = "https://nasiloldu.net";
  const persons = await storage.getAllPersons(1000);
  const categories = await storage.getAllCategories();
  const countries = await storage.getAllCountries();
  const professions = await storage.getAllProfessions();

  const urls: string[] = [
    // Static pages
    `<url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${baseUrl}/bugun</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`,
    `<url><loc>${baseUrl}/ara</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
    `<url><loc>${baseUrl}/hakkinda</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
    `<url><loc>${baseUrl}/iletisim</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
    `<url><loc>${baseUrl}/kvkk</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>`,
    `<url><loc>${baseUrl}/kullanim-sartlari</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>`,
  ];

  // Categories
  categories.forEach((category) => {
    urls.push(
      `<url><loc>${baseUrl}/kategori/${category.slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    );
  });

  // Countries
  countries.forEach((country) => {
    urls.push(
      `<url><loc>${baseUrl}/ulke/${country.slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`
    );
  });

  // Professions
  professions.forEach((profession) => {
    urls.push(
      `<url><loc>${baseUrl}/meslek/${profession.slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`
    );
  });

  // Persons
  persons.forEach((person) => {
    urls.push(
      `<url><loc>${baseUrl}/nasil-oldu/${person.slug}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`
    );
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

export function generateRobotsTxt(): string {
  const baseUrl = "https://nasiloldu.net";
  
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay
Crawl-delay: 1

# Disallow admin
User-agent: *
Disallow: /admin/
`;
}

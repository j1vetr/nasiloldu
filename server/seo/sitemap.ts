/**
 * Dinamik sitemap.xml generator
 * Google ve diğer arama motorları için XML sitemap üretir
 */

import { db } from '../db';
import { persons, categories, countries, professions } from '@shared/schema';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * XML sitemap oluşturur
 */
export async function generateSitemap(): Promise<string> {
  const baseUrl = 'https://nasiloldu.net';
  const urls: SitemapUrl[] = [];

  // Ana sayfa - en yüksek öncelik
  urls.push({
    loc: baseUrl,
    changefreq: 'daily',
    priority: 1.0,
    lastmod: new Date().toISOString().split('T')[0],
  });

  // Statik sayfalar
  const staticPages = [
    { path: '/hakkinda', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/iletisim', priority: 0.6, changefreq: 'monthly' as const },
    { path: '/kvkk', priority: 0.3, changefreq: 'yearly' as const },
    { path: '/kullanim-sartlari', priority: 0.3, changefreq: 'yearly' as const },
    { path: '/kategoriler', priority: 0.8, changefreq: 'weekly' as const },
    { path: '/ulkeler', priority: 0.8, changefreq: 'weekly' as const },
    { path: '/bugun', priority: 0.9, changefreq: 'daily' as const },
  ];

  staticPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.path}`,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });

  // Kategoriler
  const allCategories = await db.select().from(categories);
  allCategories.forEach(category => {
    urls.push({
      loc: `${baseUrl}/kategori/${category.slug}`,
      changefreq: 'weekly',
      priority: 0.8,
    });
  });

  // Ülkeler
  const allCountries = await db.select().from(countries);
  allCountries.forEach(country => {
    urls.push({
      loc: `${baseUrl}/ulke/${country.slug}`,
      changefreq: 'weekly',
      priority: 0.7,
    });
  });

  // Tüm meslekler
  const allProfessions = await db
    .select()
    .from(professions);
  
  allProfessions.forEach(profession => {
    urls.push({
      loc: `${baseUrl}/meslek/${profession.slug}`,
      changefreq: 'weekly',
      priority: 0.6,
    });
  });

  // Tüm kişiler - en yüksek öncelikli içerik
  const allPersons = await db.select({
    slug: persons.slug,
    updatedAt: persons.updatedAt,
  }).from(persons);

  allPersons.forEach(person => {
    urls.push({
      loc: `${baseUrl}/nasil-oldu/${person.slug}`,
      changefreq: 'monthly',
      priority: 0.9,
      lastmod: person.updatedAt ? new Date(person.updatedAt).toISOString().split('T')[0] : undefined,
    });
  });

  // XML oluştur
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(url => `  <url>
    <loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `
    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority !== undefined ? `
    <priority>${url.priority.toFixed(1)}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

/**
 * XML özel karakterlerini escape eder
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

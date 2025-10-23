/**
 * robots.txt generator
 * Arama motorları için crawling kuralları
 */

export function generateRobotsTxt(): string {
  const baseUrl = 'https://nasiloldu.net';
  
  return `# nasiloldu.net robots.txt
# Google'ın sitemiziçekmesine izin ver

User-agent: *
Allow: /

# Crawl edilmemesi gereken alanlar
Disallow: /admin/
Disallow: /api/
Disallow: /ara?*

# Özel bot kuralları
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 0

User-agent: Slurp
Allow: /
Crawl-delay: 1

# Sitemap konumu
Sitemap: ${baseUrl}/sitemap.xml

# Ek kurallar
# Tüm statik kaynaklar crawl edilebilir
Allow: /assets/
Allow: /attached_assets/
Allow: /*.css
Allow: /*.js
Allow: /*.png
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.gif
Allow: /*.svg
Allow: /*.webp
`;
}

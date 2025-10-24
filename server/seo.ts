// SEO utilities - sitemap, robots.txt, server-side meta tags injection
import { storage } from "./storage";
import { db } from './db';
import { persons, categories } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';
import { generateDeathStory } from '@shared/utils';

// HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

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

// Server-side SEO meta tags generator
interface SEOData {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  schema?: any;
}

export async function generateSEOData(url: string): Promise<SEOData> {
  const pathname = new URL(url, 'https://nasiloldu.net').pathname;
  
  try {
    // Ana sayfa
    if (pathname === '/') {
      const [stats] = await db.select({
        total: sql<number>`count(*)::int`
      }).from(persons);
      
      return {
        title: 'nasiloldu.net - Ünlü Kişiler Nasıl Öldü?',
        description: `${stats.total || 124}+ ünlü kişinin ölüm nedenlerini, tarihlerini ve detaylarını keşfedin. Wikidata ve Wikipedia verilerine dayalı, kapsamlı ve güncel ölüm bilgileri platformu.`,
        canonical: 'https://nasiloldu.net/',
        schema: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "nasiloldu.net",
          "url": "https://nasiloldu.net",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://nasiloldu.net/ara?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
      };
    }
    
    // Kişi detay sayfası
    const personMatch = pathname.match(/^\/nasil-oldu\/([^\/]+)$/);
    if (personMatch) {
      const slug = personMatch[1];
      const person = await storage.getPersonBySlug(slug);
      
      if (person) {
        // Calculate age (with month/day precision)
        let age: number | null = null;
        if (person.birthDate && person.deathDate) {
          const birth = new Date(person.birthDate);
          const death = new Date(person.deathDate);
          age = death.getUTCFullYear() - birth.getUTCFullYear();
          
          // Adjust if death occurred before birthday in that year
          const birthMonth = birth.getUTCMonth();
          const birthDay = birth.getUTCDate();
          const deathMonth = death.getUTCMonth();
          const deathDay = death.getUTCDate();
          
          if (deathMonth < birthMonth || (deathMonth === birthMonth && deathDay < birthDay)) {
            age--;
          }
        }
        
        // Ölüm hikayesini oluştur ve ilk 150 karakterini al
        const deathStory = generateDeathStory(person, age);
        const metaDescription = deathStory.substring(0, 150).trim() + (deathStory.length > 150 ? '...' : '');
        
        return {
          title: `${person.name} Nasıl Öldü? - nasiloldu.net`,
          description: metaDescription,
          canonical: `https://nasiloldu.net/nasil-oldu/${slug}`,
          ogImage: person.imageUrl || undefined,
          schema: {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": person.name,
            "birthDate": person.birthDate || undefined,
            "deathDate": person.deathDate || undefined,
            "deathPlace": person.deathPlace || undefined,
            "description": person.description || undefined
          }
        };
      }
    }
    
    // Kategori sayfası
    const categoryMatch = pathname.match(/^\/kategori\/([^\/]+)$/);
    if (categoryMatch) {
      const slug = categoryMatch[1];
      const [category] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
      
      if (category) {
        const [count] = await db.select({
          total: sql<number>`count(*)::int`
        }).from(persons).where(eq(persons.categoryId, category.id));
        
        return {
          title: `${category.name} Nedeniyle Ölenler - nasiloldu.net`,
          description: `${category.name} nedeniyle hayatını kaybeden ${count.total || 0} ünlü kişi. ${category.description || ''}`,
          canonical: `https://nasiloldu.net/kategori/${slug}`
        };
      }
    }
  } catch (error) {
    console.error('SEO data generation error:', error);
  }
  
  // Default SEO
  return {
    title: 'nasiloldu.net - Ünlü Kişiler Nasıl Öldü?',
    description: 'Ünlü kişilerin ölüm nedenlerini, tarihlerini ve detaylarını keşfedin.',
    canonical: `https://nasiloldu.net${pathname}`
  };
}

export function injectSEOIntoHTML(html: string, seoData: SEOData): string {
  // **CRITICAL XSS PROTECTION**: Escape all user-controlled data before injection
  const safeTitle = escapeHtml(seoData.title);
  const safeDescription = escapeHtml(seoData.description);
  const safeCanonical = escapeHtml(seoData.canonical);
  const safeOgImage = seoData.ogImage ? escapeHtml(seoData.ogImage) : null;
  
  // Title değiştir
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${safeTitle}</title>`
  );
  
  // Meta description değiştir
  html = html.replace(
    /<meta name="description" content=".*?">/,
    `<meta name="description" content="${safeDescription}">`
  );
  
  // OG tags değiştir
  html = html.replace(
    /<meta property="og:title" content=".*?">/,
    `<meta property="og:title" content="${safeTitle}">`
  );
  html = html.replace(
    /<meta property="og:description" content=".*?">/,
    `<meta property="og:description" content="${safeDescription}">`
  );
  html = html.replace(
    /<meta property="og:url" content=".*?">/,
    `<meta property="og:url" content="${safeCanonical}">`
  );
  
  if (safeOgImage) {
    html = html.replace(
      /<meta property="og:image" content=".*?">/,
      `<meta property="og:image" content="${safeOgImage}">`
    );
  }
  
  // Twitter tags değiştir
  html = html.replace(
    /<meta name="twitter:title" content=".*?">/,
    `<meta name="twitter:title" content="${safeTitle}">`
  );
  html = html.replace(
    /<meta name="twitter:description" content=".*?">/,
    `<meta name="twitter:description" content="${safeDescription}">`
  );
  html = html.replace(
    /<meta name="twitter:url" content=".*?">/,
    `<meta name="twitter:url" content="${safeCanonical}">`
  );
  
  if (safeOgImage) {
    html = html.replace(
      /<meta name="twitter:image" content=".*?">/,
      `<meta name="twitter:image" content="${safeOgImage}">`
    );
  }
  
  // Canonical URL değiştir
  html = html.replace(
    /<link rel="canonical" href=".*?">/,
    `<link rel="canonical" href="${safeCanonical}">`
  );
  
  // Schema.org JSON-LD değiştir (varsa)
  // CRITICAL: Escape </script> and line separators to prevent XSS
  if (seoData.schema) {
    const jsonLd = JSON.stringify(seoData.schema, null, 2)
      .replace(/<\//g, '<\\/')  // Escape </script> → <\/script>
      .replace(/\u2028/g, '\\u2028')  // Escape U+2028 line separator
      .replace(/\u2029/g, '\\u2029'); // Escape U+2029 paragraph separator
    
    html = html.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">\n    ${jsonLd.split('\n').join('\n    ')}\n    </script>`
    );
  }
  
  // Noscript fallback ekle (SEO için kritik!) - ALSO ESCAPED
  const noscriptContent = `
    <noscript>
      <div style="padding: 40px; text-align: center; font-family: system-ui, sans-serif; background: #000; color: #fff; min-height: 100vh;">
        <h1 style="color: #FFD60A; font-size: 32px; margin-bottom: 16px;">${safeTitle}</h1>
        <p style="color: #999; font-size: 18px; max-width: 600px; margin: 0 auto 24px;">${safeDescription}</p>
        <p style="color: #666; margin-top: 24px;">Bu siteyi görüntülemek için JavaScript'i etkinleştirmeniz gerekmektedir.</p>
      </div>
    </noscript>
  `;
  
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"></div>${noscriptContent}`
  );
  
  return html;
}

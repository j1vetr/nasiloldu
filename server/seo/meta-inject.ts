/**
 * Server-Side Meta Tag Injection
 * Crawlerlar için SEO meta taglarını HTML'e inject eder
 */

import { db } from '../db';
import { persons, categories, countries, professions } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { formatDate, formatTurkishDate } from '@shared/utils';

export interface MetaTags {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  ogImage?: string;
  keywords?: string;
  schema?: any;
}

/**
 * URL'e göre meta tagları üretir
 */
export async function generateMetaTags(url: string): Promise<MetaTags | null> {
  const baseUrl = 'https://nasiloldu.net';
  
  // Ana sayfa
  if (url === '/' || url === '') {
    // Person count - dinamik olarak çekilebilir ama şimdilik static
    const totalPersons = 236;
    return {
      title: 'Ünlü Kişiler Nasıl Öldü? | nasiloldu.net',
      description: `${totalPersons}+ ünlü kişinin ölüm nedenlerini, tarihlerini ve detaylı hayat hikayelerini keşfedin. Wikidata ve Wikipedia verilerine dayalı, Türkçe, kapsamlı ve güncel ölüm bilgileri platformu.`,
      canonical: baseUrl,
      ogType: 'website',
      ogImage: `${baseUrl}/og-image.jpg`,
      keywords: 'ünlü ölümler, ünlü kişiler, ölüm nedenleri, tarihte bugün, wikidata, ansiklopedi, Türkçe',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'nasiloldu.net',
        'url': baseUrl,
        'description': `${totalPersons}+ ünlü kişinin ölüm nedenlerini, tarihlerini ve detaylı hayat hikayelerini keşfedin. Wikidata ve Wikipedia verilerine dayalı, Türkçe, kapsamlı ve güncel ölüm bilgileri platformu.`,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${baseUrl}/ara?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    };
  }

  // Kişi detay sayfası: /nasil-oldu/:slug
  const personMatch = url.match(/^\/nasil-oldu\/([^/]+)/);
  if (personMatch) {
    const slug = personMatch[1];
    const [person] = await db.query.persons.findMany({
      where: eq(persons.slug, slug),
      with: {
        category: true,
        country: true,
        profession: true,
        deathCause: true,
      },
      limit: 1,
    });

    if (person) {
      const deathDateTurkish = formatTurkishDate(person.deathDate);
      const seoDescription = person.description 
        ? person.description.substring(0, 155) + '...'
        : `${person.name} (${person.profession.name}, ${person.country.name}) ${deathDateTurkish} tarihinde ${person.deathCause ? person.deathCause.name + ' nedeniyle' : ''} vefat etti. Doğum tarihi: ${formatTurkishDate(person.birthDate)}. Detaylı hayat hikayesi ve ölüm bilgileri.`;
      
      // Kişiye özel meta keywords
      const keywords = [
        `${person.name} nasıl öldü`,
        `${person.name} ölüm sebebi`,
        `${person.name} ölüm nedeni`,
        `${person.name} vefat`,
        person.name,
        `${person.profession.name}`,
        `${person.country.name} ünlüleri`,
        person.deathCause ? person.deathCause.name : 'ölüm nedeni',
        deathDateTurkish,
        'ünlü ölümleri',
        'wikipedia',
      ].filter(Boolean).join(', ');
      
      return {
        title: `${person.name} Nasıl Öldü? | nasiloldu.net`,
        description: seoDescription,
        canonical: `${baseUrl}/nasil-oldu/${person.slug}`,
        ogType: 'profile',
        ogImage: person.imageUrl || `${baseUrl}/og-image.jpg`,
        keywords,
        schema: {
          '@context': 'https://schema.org',
          '@type': 'Person',
          'name': person.name,
          'birthDate': person.birthDate || undefined,
          'deathDate': person.deathDate || undefined,
          'jobTitle': person.profession.name,
          'nationality': {
            '@type': 'Country',
            'name': person.country.name,
          },
          'description': person.description || `${person.name} - ${person.profession.name}`,
          'image': person.imageUrl || undefined,
        },
      };
    }
  }

  // Kategori sayfası: /kategori/:slug
  const categoryMatch = url.match(/^\/kategori\/([^/]+)/);
  if (categoryMatch) {
    const slug = categoryMatch[1];
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    
    if (category) {
      return {
        title: `${category.name} Nedeniyle Ölen Ünlüler | nasiloldu.net`,
        description: `${category.name} nedeniyle vefat eden ünlülerin detaylı hayat hikayesi ve ölüm bilgileri. ${category.name} kategorisindeki tüm ünlüleri keşfedin.`,
        canonical: `${baseUrl}/kategori/${category.slug}`,
        ogType: 'website',
        keywords: `${category.name}, ünlü ölümler, ölüm nedenleri, vefat edenler`,
      };
    }
  }

  // Ülke sayfası: /ulke/:slug
  const countryMatch = url.match(/^\/ulke\/([^/]+)/);
  if (countryMatch) {
    const slug = countryMatch[1];
    const [country] = await db.select().from(countries).where(eq(countries.slug, slug));
    
    if (country) {
      return {
        title: `${country.name} Ünlüleri Nasıl Öldü? | nasiloldu.net`,
        description: `${country.name} ülkesinden vefat eden ünlülerin detaylı hayat hikayesi ve ölüm bilgileri. ${country.name}'dan ölen ünlüleri keşfedin.`,
        canonical: `${baseUrl}/ulke/${country.slug}`,
        ogType: 'website',
        keywords: `${country.name}, ünlüler, ünlü kişiler, ölüm bilgileri, vefat edenler`,
      };
    }
  }

  // Meslek sayfası: /meslek/:slug
  const professionMatch = url.match(/^\/meslek\/([^/]+)/);
  if (professionMatch) {
    const slug = professionMatch[1];
    const [profession] = await db.select().from(professions).where(eq(professions.slug, slug));
    
    if (profession) {
      return {
        title: `${profession.name} Ünlüleri Nasıl Öldü? | nasiloldu.net`,
        description: `${profession.name} mesleğinden ünlülerin detaylı hayat hikayesi ve ölüm bilgileri. Vefat eden ${profession.name} ünlülerini keşfedin.`,
        canonical: `${baseUrl}/meslek/${profession.slug}`,
        ogType: 'website',
        keywords: `${profession.name}, ünlü kişiler, ölüm bilgileri, vefat edenler`,
      };
    }
  }

  // Statik sayfalar için default meta tags
  const staticPages: Record<string, MetaTags> = {
    '/hakkinda': {
      title: 'Hakkında - nasiloldu.net',
      description: 'nasiloldu.net hakkında bilgi edinin. Ünlü kişilerin ölüm bilgilerini Wikidata ve Wikipedia verilerine dayalı olarak sunuyoruz.',
      canonical: `${baseUrl}/hakkinda`,
      ogType: 'website',
    },
    '/iletisim': {
      title: 'İletişim - nasiloldu.net',
      description: 'nasiloldu.net ile iletişime geçin. Geri bildirimleriniz ve önerileriniz bizim için değerlidir.',
      canonical: `${baseUrl}/iletisim`,
      ogType: 'website',
    },
    '/kvkk': {
      title: 'KVKK - Kişisel Verilerin Korunması | nasiloldu.net',
      description: 'nasiloldu.net kişisel verilerin korunması politikası. KVKK kapsamında kullanıcı hakları ve veri güvenliği.',
      canonical: `${baseUrl}/kvkk`,
      ogType: 'website',
    },
    '/kullanim-sartlari': {
      title: 'Kullanım Şartları | nasiloldu.net',
      description: 'nasiloldu.net kullanım şartları ve koşulları. Platform kullanım kuralları ve sorumluluklar.',
      canonical: `${baseUrl}/kullanim-sartlari`,
      ogType: 'website',
    },
    '/kategoriler': {
      title: 'Tüm Kategoriler - nasiloldu.net',
      description: 'Ölüm kategorilerine göre ünlü kişileri keşfedin. Hastalık, kaza, intihar, suikast kategorileri.',
      canonical: `${baseUrl}/kategoriler`,
      ogType: 'website',
      keywords: 'hastalık, kaza, intihar, suikast, ölüm kategorileri',
    },
    '/ulkeler': {
      title: 'Tüm Ülkeler - nasiloldu.net',
      description: 'Ülkelere göre ünlü kişilerin ölüm bilgilerini keşfedin. 45+ ülke, 236+ ünlü kişi.',
      canonical: `${baseUrl}/ulkeler`,
      ogType: 'website',
      keywords: 'ülkeler, ünlü kişiler, ölüm bilgileri',
    },
    '/bugun': {
      title: 'Bugün Ölen Ünlüler - Ölüm Yıldönümleri | nasiloldu.net',
      description: 'Tarihte bugün vefat eden ünlü kişileri keşfedin. Günlük güncellenen ölüm yıldönümleri ve detaylı hayat hikayeleri.',
      canonical: `${baseUrl}/bugun`,
      ogType: 'website',
      keywords: 'bugün ölenler, tarihte bugün, ölüm yıldönümleri, vefat edenler',
    },
  };

  return staticPages[url] || null;
}

/**
 * Meta tagları HTML'e inject eder (duplicate prevention ile)
 */
export function injectMetaTags(html: string, meta: MetaTags): string {
  let result = html;

  // Title - replace existing
  result = result.replace(
    /<title>.*?<\/title>/,
    `<title>${escapeHtml(meta.title)}</title>`
  );

  // Remove duplicate SSR-injected tags from previous requests (if any)
  result = result.replace(/<!-- SSR Meta Tags \(for crawlers\) -->[\s\S]*?<!-- Canonical -->\s*<link rel="canonical"[^>]*>/g, '');

  // Remove existing dynamic meta tags that we'll replace
  result = result.replace(/<meta name="title"[^>]*>/g, '');
  result = result.replace(/<meta name="description"[^>]*>/g, '');
  result = result.replace(/<meta property="og:title"[^>]*>/g, '');
  result = result.replace(/<meta property="og:description"[^>]*>/g, '');
  result = result.replace(/<meta property="og:type"[^>]*>/g, '');
  result = result.replace(/<meta property="og:url"[^>]*>/g, '');
  result = result.replace(/<meta property="og:image"[^>]*>/g, '');
  result = result.replace(/<meta name="twitter:title"[^>]*>/g, '');
  result = result.replace(/<meta name="twitter:description"[^>]*>/g, '');
  result = result.replace(/<meta name="twitter:image"[^>]*>/g, '');
  result = result.replace(/<link rel="canonical"[^>]*>/g, '');

  // Meta tags
  const metaTags = `
    <!-- SSR Meta Tags (for crawlers) -->
    <meta name="title" content="${escapeHtml(meta.title)}" />
    <meta name="description" content="${escapeHtml(meta.description)}" />
    ${meta.keywords ? `<meta name="keywords" content="${escapeHtml(meta.keywords)}" />` : ''}
    
    <!-- Open Graph -->
    <meta property="og:type" content="${meta.ogType || 'website'}" />
    <meta property="og:url" content="${escapeHtml(meta.canonical)}" />
    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    ${meta.ogImage ? `<meta property="og:image" content="${escapeHtml(meta.ogImage)}" />` : ''}
    <meta property="og:site_name" content="nasiloldu.net" />
    <meta property="og:locale" content="tr_TR" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
    ${meta.ogImage ? `<meta name="twitter:image" content="${escapeHtml(meta.ogImage)}" />` : ''}
    
    <!-- Canonical -->
    <link rel="canonical" href="${escapeHtml(meta.canonical)}" />
    
    ${meta.schema ? `<!-- Schema.org JSON-LD (SSR) -->
    <script type="application/ld+json">${JSON.stringify(meta.schema)}</script>` : ''}
  `;

  // Inject before </head>
  result = result.replace('</head>', `${metaTags}\n  </head>`);

  return result;
}

/**
 * HTML özel karakterlerini escape eder
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Server-Side Rendering (SSR) Management
 * Meta tag'leri ve sayfa içeriğini yönetir
 */

import { type Request, type Response } from "express";
import fs from "fs";
import {
  renderHomePage,
  renderPersonDetailPage,
  renderCategoryPage,
  renderCountryPage,
  renderProfessionPage,
  renderTodayPage,
  renderCategoriesPage,
  renderCountriesPage,
  renderStaticPage,
} from "./render";
import { generateMetaTags, type MetaTags } from "./seo/meta-inject";

/**
 * HTML'i meta tag'ler ve içerikle birlikte render et
 */
export async function renderHTMLWithMeta(
  req: Request,
  res: Response,
  templatePath: string
) {
  try {
    const url = req.originalUrl.split("?")[0]; // Query params'ı kaldır
    
    // Admin ve API route'larını skip et
    const skipSSR = url.startsWith("/admin") || 
                    url.startsWith("/api") ||
                    url === "/ara"; // Arama client-side
    
    if (skipSSR) {
      // SSR olmadan normal HTML gönder
      const html = await fs.promises.readFile(templatePath, "utf-8");
      return res.status(200).set({ "Content-Type": "text/html" }).send(html);
    }
    
    // Meta tag'leri oluştur
    const meta = await generateMetaTags(url);
    
    // HTML template'ini oku
    let html = await fs.promises.readFile(templatePath, "utf-8");
    
    // URL'i parse et ve içeriği render et
    let renderedContent = "";
    let contentStatusCode = 200;
    
    const parts = url.split("/").filter(Boolean);
    
    if (parts.length === 0 || url === "/") {
      // Ana sayfa: /
      const result = await renderHomePage();
      renderedContent = result.html;
      contentStatusCode = result.statusCode;
    } else if (parts.length === 2 && parts[0] === "nasil-oldu") {
      // Kişi detay: /nasil-oldu/:slug
      const result = await renderPersonDetailPage(parts[1]);
      renderedContent = result.html;
      contentStatusCode = result.statusCode;
    } else if (parts.length === 2 && parts[0] === "kategori") {
      // Kategori: /kategori/:slug
      const result = await renderCategoryPage(parts[1]);
      renderedContent = result.html;
      contentStatusCode = result.statusCode;
    } else if (parts.length === 2 && parts[0] === "ulke") {
      // Ülke: /ulke/:slug
      const result = await renderCountryPage(parts[1]);
      renderedContent = result.html;
      contentStatusCode = result.statusCode;
    } else if (parts.length === 2 && parts[0] === "meslek") {
      // Meslek: /meslek/:slug
      const result = await renderProfessionPage(parts[1]);
      renderedContent = result.html;
      contentStatusCode = result.statusCode;
    } else if (parts.length === 1 && parts[0] === "bugun") {
      // Bugün ölenler: /bugun
      const result = await renderTodayPage();
      renderedContent = result.html;
      contentStatusCode = result.statusCode;
    } else if (parts.length === 1 && parts[0] === "kategoriler") {
      // Kategoriler listesi: /kategoriler
      const result = await renderCategoriesPage();
      renderedContent = result.html;
      contentStatusCode = result.statusCode;
    } else if (parts.length === 1 && parts[0] === "ulkeler") {
      // Ülkeler listesi: /ulkeler
      const result = await renderCountriesPage();
      renderedContent = result.html;
      contentStatusCode = result.statusCode;
    } else if (parts.length === 1 && ['hakkinda', 'iletisim', 'kvkk', 'kullanim-sartlari'].includes(parts[0])) {
      // Statik sayfalar
      const result = await renderStaticPage(parts[0] as 'hakkinda' | 'iletisim' | 'kvkk' | 'kullanim-sartlari');
      renderedContent = result.html;
      contentStatusCode = result.statusCode;
    } else {
      // 404 - Bilinmeyen route
      renderedContent = '<div class="container mx-auto px-4 py-8"><h1 class="text-4xl font-bold mb-4">404 - Sayfa Bulunamadı</h1><p class="text-muted-foreground">Aradığınız sayfa bulunamadı.</p></div>';
      contentStatusCode = 404;
    }
    
    // Meta tag'leri inject et (fallback ile)
    const finalMeta = meta || {
      title: '404 - Sayfa Bulunamadı | nasiloldu.net',
      description: 'Aradığınız sayfa bulunamadı.',
      canonical: `https://nasiloldu.net${url}`,
      ogType: 'website',
    };
    html = injectMetaTagsWithPlaceholders(html, finalMeta);
    
    // Render edilmiş içeriği root div'e inject et
    if (renderedContent) {
      html = html.replace(
        '<div id="root"></div>',
        `<div id="root">${renderedContent}</div>`
      );
    }
    
    // Daha kısıtlayıcı status code'u kullan
    const finalStatusCode = contentStatusCode !== 200 ? contentStatusCode : 200;
    
    res.status(finalStatusCode).set({ "Content-Type": "text/html" }).send(html);
  } catch (error) {
    console.error("SSR Render Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

/**
 * Meta tag'leri placeholder'lar ile inject eder
 */
function injectMetaTagsWithPlaceholders(html: string, meta: MetaTags): string {
  let result = html;

  // Title'ı değiştir
  result = result.replace(
    /<title>.*?<\/title>/,
    `<title>${escapeHtml(meta.title)}</title>`
  );

  // Önceki SSR tag'lerini temizle (duplicate prevention)
  result = result.replace(/<!-- SSR Meta Tags -->[\s\S]*?<!-- End SSR Meta Tags -->/g, '');
  
  // Primary Meta Tags kısmındaki tag'leri REPLACE et (silmek yerine)
  // Meta title
  if (result.includes('<meta name="title"')) {
    result = result.replace(
      /<meta name="title"[^>]*>/,
      `<meta name="title" content="${escapeHtml(meta.title)}" />`
    );
  } else {
    // Yoksa title'dan sonra ekle
    result = result.replace(
      /(<title>.*?<\/title>)/,
      `$1\n    <meta name="title" content="${escapeHtml(meta.title)}" />`
    );
  }
  
  // Meta description
  if (result.includes('<meta name="description"')) {
    result = result.replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${escapeHtml(meta.description)}" />`
    );
  } else {
    // Yoksa meta title'dan sonra ekle
    result = result.replace(
      /(<meta name="title"[^>]*>)/,
      `$1\n    <meta name="description" content="${escapeHtml(meta.description)}" />`
    );
  }
  
  // Meta keywords (kişiye özel)
  if (meta.keywords) {
    if (result.includes('<meta name="keywords"')) {
      result = result.replace(
        /<meta name="keywords"[^>]*>/,
        `<meta name="keywords" content="${escapeHtml(meta.keywords)}" />`
      );
    } else {
      // Yoksa meta description'dan sonra ekle
      result = result.replace(
        /(<meta name="description"[^>]*>)/,
        `$1\n    <meta name="keywords" content="${escapeHtml(meta.keywords)}" />`
      );
    }
  }
  
  // OG ve Twitter tag'lerini replace et
  result = result.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`);
  result = result.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`);
  result = result.replace(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${meta.ogType || 'website'}" />`);
  result = result.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`);
  
  // OG image (varsa replace, yoksa ekle)
  if (meta.ogImage) {
    if (result.includes('<meta property="og:image"')) {
      result = result.replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${escapeHtml(meta.ogImage)}" />`);
    } else {
      result = result.replace(
        /(<meta property="og:url"[^>]*>)/,
        `$1\n    <meta property="og:image" content="${escapeHtml(meta.ogImage)}" />`
      );
    }
  }
  
  // Twitter tags
  result = result.replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`);
  result = result.replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`);
  if (meta.ogImage) {
    result = result.replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${escapeHtml(meta.ogImage)}" />`);
  }
  
  // Canonical
  result = result.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`);
  
  // Schema.org JSON-LD (SSR kısmına ekle)
  if (meta.schema) {
    const schemaTag = `
    <!-- SSR Meta Tags -->
    <!-- Schema.org JSON-LD (SSR) -->
    <script type="application/ld+json">${JSON.stringify(meta.schema)}</script>
    <!-- End SSR Meta Tags -->`;
    result = result.replace('</head>', `${schemaTag}\n  </head>`);
  }

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

/**
 * Meta tag interface with statusCode
 */
interface MetaTagsWithStatus extends MetaTags {
  statusCode?: number;
}

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
    }
    
    // Meta tag'leri inject et (eğer meta varsa)
    if (meta) {
      html = injectMetaTagsWithPlaceholders(html, meta);
    }
    
    // Render edilmiş içeriği root div'e inject et
    if (renderedContent) {
      html = html.replace(
        '<div id="root"></div>',
        `<div id="root">${renderedContent}</div>`
      );
    }
    
    // Daha kısıtlayıcı status code'u kullan
    const finalStatusCode = contentStatusCode !== 200 ? contentStatusCode : (meta?.statusCode || 200);
    
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

  // Duplicate meta tag'leri kaldır
  result = result.replace(/<!-- SSR Meta Tags \(for crawlers\) -->[\s\S]*?<!-- Canonical -->\s*<link rel="canonical"[^>]*>/g, '');
  
  // Existing dynamic meta tags'i kaldır
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

  // Meta tags'i inject et
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

/**
 * Meta tag interface with statusCode
 */
interface MetaTagsWithStatus extends MetaTags {
  statusCode?: number;
}

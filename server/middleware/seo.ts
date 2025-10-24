/**
 * SEO Middleware
 * Crawler botları tespit eder ve server-side meta tag injection yapar
 */

import { Request, Response, NextFunction } from 'express';
import { generateMetaTags, injectMetaTags } from '../seo/meta-inject';
import fs from 'fs';
import path from 'path';

/**
 * User agent'ın crawler olup olmadığını kontrol eder
 */
function isCrawler(userAgent: string): boolean {
  const crawlers = [
    'Googlebot',
    'Google-InspectionTool', // Google Search Console
    'Bingbot',
    'Slurp', // Yahoo
    'DuckDuckBot',
    'Baiduspider',
    'YandexBot',
    'facebookexternalhit', // Facebook
    'Twitterbot',
    'LinkedInBot',
    'WhatsApp',
    'TelegramBot',
    'Discordbot',
    'Slackbot',
    'redditbot',
    'SkypeUriPreview',
    'HeadlessChrome',
    'Lighthouse',
    'PageSpeed',
  ];

  const ua = userAgent.toLowerCase();
  return crawlers.some(crawler => ua.includes(crawler.toLowerCase()));
}

/**
 * SEO middleware - Crawler'lar için HTML'i modify eder
 */
export async function seoMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userAgent = req.get('user-agent') || '';
  const url = req.path;

  // Sadece HTML sayfaları için çalış (query params dahil search pages)
  if (!req.accepts('html') || url.startsWith('/api/') || url.startsWith('/assets/') || url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return next();
  }

  // EVERYONE gets SSR - not just crawlers
  // This ensures all users see correct meta tags and initial content
  // (React will hydrate on client-side)

  try {
    // URL için meta tagları üret
    const metaTags = await generateMetaTags(url);
    
    if (!metaTags) {
      return next();
    }

    // HTML template'ini oku
    let html: string;
    
    if (process.env.NODE_ENV === 'production') {
      // Production: dist'ten oku
      const htmlPath = path.join(process.cwd(), 'dist', 'public', 'index.html');
      html = fs.readFileSync(htmlPath, 'utf-8');
    } else {
      // Development: client/index.html'den oku
      const htmlPath = path.join(process.cwd(), 'client', 'index.html');
      html = fs.readFileSync(htmlPath, 'utf-8');
    }

    // Meta tagları inject et
    const modifiedHtml = injectMetaTags(html, metaTags);

    // Modified HTML'i gönder
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'index, follow');
    res.send(modifiedHtml);
    
  } catch (error) {
    console.error('SEO middleware error:', error);
    next();
  }
}

/**
 * SEO Middleware
 * Production: SSR rendering + meta tag injection for all users
 * Development: Meta tag injection for crawlers only
 */

import { Request, Response, NextFunction } from 'express';
import { generateMetaTags, injectMetaTags } from '../seo/meta-inject';
import { renderPageSSR } from '../ssr';
import fs from 'fs';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';

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
 * Production SSR Middleware - Serves SSR HTML to all users
 */
export async function productionSSRMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Only run in production
  if (!isProd) {
    return next();
  }

  const url = req.path;

  // Skip non-HTML requests
  if (!req.accepts('html') || url.startsWith('/api/') || url.startsWith('/assets/') || url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return next();
  }

  try {
    // Load HTML template
    const htmlPath = path.join(process.cwd(), 'dist', 'public', 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf-8');

    // Render React app with SSR
    html = await renderPageSSR(url, html);

    // Generate and inject meta tags
    const metaTags = await generateMetaTags(url);
    if (metaTags) {
      html = injectMetaTags(html, metaTags);
    }

    // Send SSR HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'index, follow');
    res.send(html);
    
  } catch (error) {
    console.error('❌ Production SSR middleware error:', error);
    next();
  }
}

/**
 * Development SEO Middleware - Meta tag injection for crawlers only
 */
export async function developmentSEOMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Only run in development
  if (isProd) {
    return next();
  }

  const userAgent = req.get('user-agent') || '';
  const url = req.path;

  // Skip non-HTML requests
  if (!req.accepts('html') || url.startsWith('/api/') || url.startsWith('/assets/') || url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return next();
  }

  // Crawler değilse normal akışa devam et
  if (!isCrawler(userAgent)) {
    return next();
  }

  try {
    // URL için meta tagları üret
    const metaTags = await generateMetaTags(url);
    
    if (!metaTags) {
      return next();
    }

    // HTML template'ini oku
    const htmlPath = path.join(process.cwd(), 'client', 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf-8');

    // Meta tagları inject et
    html = injectMetaTags(html, metaTags);

    // Modified HTML'i gönder
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'index, follow');
    res.send(html);
    
  } catch (error) {
    console.error('SEO middleware error:', error);
    next();
  }
}

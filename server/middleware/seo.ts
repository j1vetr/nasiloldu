/**
 * Universal SSR Middleware
 * Renders React on server for ALL users in BOTH dev and production
 */

import { Request, Response, NextFunction } from 'express';
import { generateMetaTags, injectMetaTags } from '../seo/meta-inject';
import { storage } from '../storage';
import { QueryClient } from '@tanstack/react-query';
import fs from 'fs';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';

/**
 * Universal SSR Middleware - Works in both dev and production
 */
export async function universalSSRMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const url = req.path;

  // Skip non-HTML requests
  if (!req.accepts('html') || url.startsWith('/api/') || url.startsWith('/assets/') || url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return next();
  }

  try {
    // Create fresh QueryClient for this request
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          retry: false,
        },
      },
    });

    // DATA PREFETCHING - Based on route
    await prefetchRouteData(url, queryClient);

    // Use entry-server.tsx to render
    const { render } = await import('../../client/src/entry-server');
    const { html: appHtml, dehydratedState } = await render(url, queryClient);

    // Load HTML template
    let html: string;
    if (isProd) {
      const htmlPath = path.join(process.cwd(), 'dist', 'public', 'index.html');
      html = fs.readFileSync(htmlPath, 'utf-8');
    } else {
      const htmlPath = path.join(process.cwd(), 'client', 'index.html');
      html = fs.readFileSync(htmlPath, 'utf-8');
    }

    // Inject SSR HTML
    html = html.replace(
      /<div id="root"[^>]*>[\s\S]*?<\/div>/,
      `<div id="root">${appHtml}</div>`
    );

    // Inject dehydrated state
    const stateScript = `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState).replace(/</g, '\\u003c')};</script>`;
    html = html.replace(/<\/body>/, `${stateScript}\n  </body>`);

    // Generate and inject SEO meta tags
    const metaTags = await generateMetaTags(url);
    if (metaTags) {
      html = injectMetaTags(html, metaTags);
    }

    // Send complete SSR HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'index, follow');
    res.send(html);
    
  } catch (error) {
    console.error('❌ Universal SSR error:', error);
    next();
  }
}

/**
 * Prefetch data based on route
 */
async function prefetchRouteData(url: string, queryClient: QueryClient) {
  try {
    // Home page
    if (url === '/') {
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: ['/api/stats'],
          queryFn: async () => storage.getStats(),
        }),
        queryClient.prefetchQuery({
          queryKey: ['/api/categories'],
          queryFn: async () => storage.getAllCategories(),
        }),
        queryClient.prefetchQuery({
          queryKey: ['/api/persons/popular'],
          queryFn: async () => storage.getPopularPersons(6),
        }),
        queryClient.prefetchQuery({
          queryKey: ['/api/persons/recent'],
          queryFn: async () => storage.getRecentPersons(6),
        }),
        queryClient.prefetchQuery({
          queryKey: ['/api/persons/today'],
          queryFn: async () => storage.getTodayPersons(),
        }),
      ]);
    }

    // Person detail page
    const personMatch = url.match(/^\/nasil-oldu\/([^\/]+)$/);
    if (personMatch) {
      const slug = personMatch[1];
      const person = await storage.getPersonBySlug(slug);
      if (person) {
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: ['/api/persons', slug],
            queryFn: async () => person,
          }),
          queryClient.prefetchQuery({
            queryKey: ['/api/persons', slug, 'related'],
            queryFn: async () => storage.getRelatedPersons(person.id, 6),
          }),
        ]);
      }
    }

    // Category page
    const categoryMatch = url.match(/^\/kategori\/([^\/]+)$/);
    if (categoryMatch) {
      const categorySlug = categoryMatch[1];
      const category = await storage.getCategoryBySlug(categorySlug);
      if (category) {
        await queryClient.prefetchQuery({
          queryKey: ['/api/categories', categorySlug, 'persons'],
          queryFn: async () => storage.getPersonsByCategory(category.id),
        });
      }
    }

    // Country page
    const countryMatch = url.match(/^\/ulke\/([^\/]+)$/);
    if (countryMatch) {
      const countrySlug = countryMatch[1];
      const country = await storage.getCountryBySlug(countrySlug);
      if (country) {
        await queryClient.prefetchQuery({
          queryKey: ['/api/countries', countrySlug, 'persons'],
          queryFn: async () => storage.getPersonsByCountry(country.id),
        });
      }
    }

    // Profession page
    const professionMatch = url.match(/^\/meslek\/([^\/]+)$/);
    if (professionMatch) {
      const professionSlug = professionMatch[1];
      const profession = await storage.getProfessionBySlug(professionSlug);
      if (profession) {
        await queryClient.prefetchQuery({
          queryKey: ['/api/professions', professionSlug, 'persons'],
          queryFn: async () => storage.getPersonsByProfession(profession.id),
        });
      }
    }

    // Today page
    if (url === '/bugun') {
      await queryClient.prefetchQuery({
        queryKey: ['/api/persons/today'],
        queryFn: async () => storage.getTodayPersons(),
      });
    }

    // Categories page
    if (url === '/kategoriler') {
      await queryClient.prefetchQuery({
        queryKey: ['/api/categories'],
        queryFn: async () => storage.getAllCategories(),
      });
    }

    // Countries page
    if (url === '/ulkeler') {
      await queryClient.prefetchQuery({
        queryKey: ['/api/countries'],
        queryFn: async () => storage.getAllCountries(),
      });
    }
  } catch (error) {
    console.error('⚠️  Data prefetch error:', error);
    // Continue with empty cache
  }
}

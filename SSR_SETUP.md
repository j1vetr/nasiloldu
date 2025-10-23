# Production SSR Setup Guide

## Overview

This project uses **Production-Only SSR** (Server-Side Rendering). 

- **Development Mode**: Client-Side Rendering (CSR) - Fast HMR, instant updates
- **Production Mode**: Full SSR - SEO-optimized, crawlers see rendered HTML

## Architecture

### Entry Points

1. **client/src/entry-client.tsx** - Client hydration
   - Runs in browser
   - Hydrates server-rendered HTML
   - Takes over with React

2. **client/src/entry-server.tsx** - Server rendering
   - Runs on Node.js (production only)
   - Renders React to HTML string
   - Includes TanStack Query dehydration

### Build Process

The SSR build creates two bundles:

1. **Client Bundle** → `dist/public/`
   - Static assets (JS, CSS, images)
   - Hydration scripts
   - Served by Express

2. **Server Bundle** → `dist/server/`
   - React SSR rendering engine
   - Loaded by Express middleware
   - Generates HTML for each request

## Building for Production

### Step 1: Run SSR Build Script

```bash
node scripts/build-ssr.js
```

This will:
- ✅ Build client bundle (dist/public)
- ✅ Build server bundle (dist/server)
- ✅ Generate manifests

**Output:**
```
dist/
├── public/          # Client bundle (served statically)
│   ├── assets/
│   ├── index.html
│   └── manifest.json
└── server/          # Server bundle (SSR rendering)
    └── entry-server.js
```

### Step 2: Start Production Server

```bash
NODE_ENV=production npm start
```

## How It Works

### Development Mode (NODE_ENV=development)

1. Vite dev server serves `client/index.html`
2. Browser loads `/src/main.tsx` (CSR)
3. React renders in browser
4. Crawlers get meta tag injection only (no SSR)

**Flow:**
```
Request → Express → Vite Middleware → client/index.html → Browser renders React
```

### Production Mode (NODE_ENV=production)

1. Express loads `dist/public/index.html` template
2. SSR middleware (`server/ssr.ts`) renders React to HTML
3. SEO middleware injects meta tags
4. Browser receives fully rendered HTML
5. Client hydrates and takes over

**Flow:**
```
Request → Express → SSR Render → Meta Injection → Full HTML → Browser hydrates
```

## Middleware Stack

### Production SSR Middleware
- **File**: `server/middleware/seo.ts` → `productionSSRMiddleware`
- **Runs**: Production only
- **Does**:
  1. Loads HTML template
  2. Renders React with SSR
  3. Injects meta tags
  4. Sends complete HTML

### Development SEO Middleware
- **File**: `server/middleware/seo.ts` → `developmentSEOMiddleware`
- **Runs**: Development only, crawlers only
- **Does**:
  1. Detects crawler user-agent
  2. Injects meta tags (no SSR)
  3. Sends modified HTML

## SSR Features

✅ **Full React Rendering**
- Server renders entire app (Header, Footer, Routes)
- Crawler-friendly HTML content
- Zero JavaScript required for initial view

✅ **TanStack Query SSR**
- Server prefetches data
- Dehydrates query state
- Client rehydrates seamlessly

✅ **Wouter SSR Support**
- Static location hook for server
- Renders correct route on server
- Client hydrates at same route

✅ **SEO Optimization**
- Dynamic meta tags per page
- Schema.org JSON-LD injection
- Open Graph & Twitter Cards

## Testing SSR

### Test Server Rendering

```bash
# Build SSR bundles
node scripts/build-ssr.js

# Start production server
NODE_ENV=production npm start

# Fetch HTML (should see rendered React content)
curl http://localhost:5000/
curl http://localhost:5000/nasil-oldu/mustafa-kemal-ataturk
```

### Expected Output

**CSR (Development):**
```html
<div id="root"></div>
<script type="module" src="/src/entry-client.tsx"></script>
```

**SSR (Production):**
```html
<div id="root">
  <div><!-- Full React HTML here --></div>
</div>
<script>window.__REACT_QUERY_STATE__ = {...};</script>
<script type="module" src="/assets/entry-client-[hash].js"></script>
```

## Troubleshooting

### "SSR server entry not found"

**Problem**: Production server can't find `dist/server/entry-server.js`

**Solution**:
```bash
node scripts/build-ssr.js
```

### Hydration Warnings

**Problem**: "Warning: Expected server HTML to contain..."

**Cause**: Server and client render different HTML

**Solution**:
- Check date formatting (use UTC methods)
- Avoid client-only logic in components
- Ensure data matches between server/client

### Build Errors

**Problem**: Vite build fails

**Common fixes**:
- Clear `dist/` folder
- Check for import errors
- Verify all dependencies installed

## Performance

### Time to First Byte (TTFB)
- **CSR**: ~50ms (empty HTML)
- **SSR**: ~150-300ms (rendered HTML)

### First Contentful Paint (FCP)
- **CSR**: 1-2 seconds (wait for JS)
- **SSR**: 300-500ms (immediate content)

### SEO Crawling
- **CSR**: Delayed (JS execution)
- **SSR**: Instant (full HTML)

## Key Files

- `scripts/build-ssr.js` - Production build script
- `server/ssr.ts` - SSR rendering engine
- `server/middleware/seo.ts` - SSR + SEO middleware
- `client/src/entry-server.tsx` - Server entry point
- `client/src/entry-client.tsx` - Client hydration

## Notes

- **No vite.config.ts changes**: Uses runtime SSR instead
- **No package.json changes**: Standalone build script
- **Development unchanged**: Keep using `npm run dev`
- **Forbidden files preserved**: `server/vite.ts` untouched

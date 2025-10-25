# nasiloldu.net - Ünlüler Nasıl Öldü?

## Overview
nasiloldu.net is a comprehensive, Turkish-language platform providing information on celebrity deaths, leveraging Wikidata. The project aims to be a modern, SEO-optimized information hub with a distinctive yellow and black color scheme, offering detailed insights into how famous individuals passed away. It includes a dataset of 236 persons, focusing on politicians, journalists, academics, artists, and historical figures. The platform categorizes deaths by cause (illness, assassination, accident, suicide) and allows filtering by country and profession. Content is bilingual with automated Turkish Wikipedia integration for descriptions.

## User Preferences
- All content must be in Turkish.
- Use a Wikipedia-style encyclopedic narrative.
- Ensure data de-duplication using Wikidata QIDs.
- Every person *must* have an assigned country and profession.
- Missing information should be displayed as "Bilinmiyor" (Unknown).
- Implement Turkish capitalization rules (e.g., i→İ) using shared utility functions.
- For historical figures, extract full text descriptions from Wikipedia, targeting a minimum of 500 words.
- Ensure correct handling of Turkish characters in slugs and search functionality (e.g., â, î, û, İ for slugs; unaccent for search).
- Maintain a consistent title format across all pages: `[Content] | nasiloldu.net`.
- Prioritize Google-first SEO practices, ensuring parity between client-side and server-side rendered meta tags.
- Accept some incorrect Wikidata QIDs (~3-5 persons) rather than manual correction - generic Turkish text used as fallback.

## System Architecture

### UI/UX Decisions
- **Color Palette**: Primary Yellow (#FFD60A), Background Black (#000000).
- **Theme**: Default Dark Mode.
- **Hero Section**: Animated glow orbs, radial grid background, two-part gradient title, minimal design with modern stats pills, scroll indicator animation, `min-h-[75vh]` height.
- **Navbar**: Logo integration, h-20 height, black background with backdrop-blur-xl, centered navigation for desktop, "Keşfet" CTA button with gradient yellow, active state styling.
- **Mobile Responsiveness**: Header Sheet menu, responsive breakpoints for the homepage.
- **Iconography**: `lucide-react` icons replace emojis for universal design.

### Technical Implementations
- **Frontend**: React, Wouter (routing), TanStack Query, Tailwind CSS, shadcn/ui.
- **Backend**: Express.js, Node.js.
- **Database**: PostgreSQL (Neon).
- **ORM**: Drizzle ORM.
- **Data Source**: Wikidata SPARQL API.
- **SEO Optimization**:
    - Meta tags (title, description, keywords, robots), Open Graph tags, Twitter Cards, Canonical URLs.
    - Schema.org JSON-LD (WebSite, CollectionPage, BreadcrumbList, Person) with dynamic data.
    - Hreflang tags (tr, x-default), language & geo tags (Turkish, TR).
    - Sitemap.xml (dynamic generation for static pages, categories, countries, professions, persons) and robots.txt (with bot-specific rules and sitemap reference).
    - SSR Meta Tag Injection with crawler detection (Googlebot, Bingbot, etc.) for dynamic content.
- **Performance Optimizations**: Compression middleware (gzip/deflate), cache headers (static assets: 1 year immutable, HTML: 1 hour revalidate), DNS prefetch, font display swap, resource hints (preconnect).
- **Image SEO**: Alt tags, lazy loading, high-quality Wikidata image URLs.
- **Search System**: AJAX-based search with real-time `/api/search` queries, dropdown results (max 8), loading spinner, empty state, click-outside close, and navigation. Supports Turkish characters via PostgreSQL `unaccent` extension.
- **Date Handling**: UTC accessor-based `formatDate`/`formatTurkishDate` functions for timezone-independent and consistent date display, with NaN validation and "Bilinmiyor" fallback.
- **Scroll Management**: `ScrollToTop` component and `window.history.scrollRestoration = 'manual'` to ensure consistent scroll position at the top on all navigations.
- **Wikipedia Turkish Integration**: Automated script (`scripts/update-turkish-descriptions.ts`) fetches Turkish descriptions from Wikipedia using Wikidata QIDs, with generic Turkish fallback for missing pages.

### Feature Specifications
- **Wikidata Integration**: 367 persons in database with Turkish Wikipedia descriptions (160 Turkish, 207 English = 43% Turkish).
- **Country Coverage**: 100 countries (45 original + 55 newly added) covering all major world regions.
- **Category System**: Persons assigned to a death category (Illness, Accident, Suicide, Assassination).
- **Filtering**: By country and profession.
- **Search**: By person's name.
- **Related Persons**: Minimum 6 related persons on each individual's page.
- **Admin Panel**: PostgreSQL-based authentication for `admins`.
- **Content Localization**: Turkish Wikipedia integration with automated fallback for missing pages.

### System Design Choices
- **Database Schema**: `admins`, `categories`, `countries`, `professions`, `death_causes`, `persons` (linked to Wikidata by QID).
- **API Endpoints**: Comprehensive set of backend API endpoints supporting frontend functionality.
- **Slug Optimization**: `createSlug` function handles Turkish characters correctly for URL-friendly slugs.

## External Dependencies
- **Wikidata SPARQL API**: Primary data source for celebrity information.
- **Wikipedia REST API**: Turkish description extraction using Wikidata QID mapping.
- **PostgreSQL (Neon)**: Database for storing application-specific data and cached Wikidata information.
- **country-flag-icons**: For displaying SVG country flags.
- **Google Analytics 4 & Search Console**: Placeholders for future integration.
- **fonts.googleapis.com, fonts.gstatic.com**: For fonts.

## Recent Updates (October 25, 2025)
- ✅ **Database Expansion**: Added 97 political leaders (302 → 367 persons total)
- ✅ **Country Coverage**: Added 55 countries (45 → 100 total) covering all major regions
  - Asia: Japan, India, Iran, Pakistan, Indonesia, Thailand, Vietnam, Korea, Israel, etc.
  - Europe: Poland, Netherlands, Belgium, Portugal, Greece, Norway, Denmark, Finland, etc.
  - Americas: Mexico, Cuba, Chile, Colombia, Venezuela, Peru, Ecuador, etc.
  - Africa: South Africa, Ghana, Ethiopia, Zimbabwe, Nigeria, Egypt, DR Congo, etc.
- ✅ **Country Backfill**: 13 leaders assigned correct countries (Mahatma Gandhi → India, Fidel Castro → Cuba, Nelson Mandela → South Africa, etc.)
- ✅ **Wikidata QID Mapping**: Expanded to 80+ countries for accurate auto-assignment
- ✅ **Turkish Content**: 160/367 persons (43%) now have Turkish descriptions
- ✅ Fixed SSR meta tag injection (replace strategy prevents duplicates)
- ✅ Person-specific meta keywords (e.g., "Adolf Hitler nasıl öldü, Adolf Hitler ölüm sebebi")
- ✅ Enhanced person detail SSR pages:
  - "Ölüm Bilgileri" section (death date, age, location, cause)
  - "Detaylı Bilgiler" sidebar (birth date, profession, country)
- ✅ Footer component on all SSR pages (home, person, category, country, profession, today, static)
- ✅ Turkified all 51 profession slugs (merged 8 duplicates, converted 43 English slugs)
- ✅ "Ölüm Hikayesi" section added (factual death narrative, positioned before biography)
- ✅ Death story function made objective and neutral - removed all dramatic/emotional language
- ✅ Cleaned index.html (removed all HTML comments except TOOV branding, removed Google Analytics)
- ⚠️ Known issue: ~3-5 incorrect Wikidata QIDs (accepted, generic text used)
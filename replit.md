# nasiloldu.net - Ünlüler Nasıl Öldü?

## Overview
nasiloldu.net is a comprehensive, Turkish-language platform dedicated to providing information about how famous individuals died, powered by Wikidata. The project aims to be a modern, SEO-optimized knowledge hub with a distinctive yellow and black color palette, offering detailed biographical and death-related information for celebrities, politicians, academics, and other notable figures. Its core purpose is to compile and present accessible, encyclopedic content on this specific subject.

## User Preferences
I prefer detailed explanations. Do not make changes to the folder `Z`. Do not make changes to the file `Y`. I want iterative development. Ask before making major changes. I prefer simple language. I like functional programming.

## System Architecture

### UI/UX Decisions
The platform features a primary yellow (`#FFD60A`) and black (`#000000`) color palette, with dark mode as the default theme. The design incorporates modern elements like animated glow orbs, a radial grid pattern background in the hero section, and glassmorphic stats pills. Navigation is optimized for both desktop (centered navigation with a "Keşfet" CTA button) and mobile (header sheet menu). Logos and icons are integrated using `@assets` and `lucide-react` for a universal design.

### Technical Implementations
- **Frontend**: React, Wouter for routing, TanStack Query for data fetching, Tailwind CSS for styling, and shadcn/ui for UI components.
- **Backend**: Express.js with Node.js.
- **Database**: PostgreSQL (Neon) managed with Drizzle ORM.
- **Data Source**: Wikidata SPARQL API for comprehensive and up-to-date information.
- **Core Features**:
    - **Wikidata Integration**: Initial dataset of 500 individuals, with ongoing synchronization.
    - **Categorization**: Mandatory assignment of each person to a death category (e.g., Illness, Accident, Suicide, Assassination).
    - **Filtering**: Ability to filter individuals by country and profession.
    - **Search**: Real-time AJAX search functionality with type-ahead suggestions and Türkçe character support.
    - **Related Persons**: Display of at least 6 related individuals on each person's detail page.
    - **Admin Panel**: PostgreSQL-based authentication for managing content.
    - **SEO Optimization**: Extensive meta tags, Schema.org JSON-LD (WebSite, Person, BreadcrumbList, CollectionPage), sitemap.xml, robots.txt, canonical URLs, hreflang, and SSR for crawler visibility.
    - **Internationalization**: Full Turkish content support, including locale-specific capitalization and slug generation.
    - **Performance**: Compression middleware, cache headers, DNS prefetch, font display swap, and lazy loading for images.
    - **SSR Implementation**: Dual-mode architecture (CSR for development, full SSR for production) with server-side rendering of React components and meta tag injection.

### Feature Specifications
- **Pages**: Home, Person Detail, Category, Country, Profession, Today, Search, About, Contact, KVKK, Terms, Admin Login, Admin Dashboard.
- **Database Schema**: `admins`, `categories`, `countries`, `professions`, `death_causes`, `persons` (linked to Wikidata by QID).
- **Hero Section**: Dynamic, animated hero section with an AJAX search bar.
- **Date Handling**: Robust `formatDate`/`formatTurkishDate` functions in `shared/utils.ts` for consistent, timezone-independent date display with "Bilinmiyor" fallback for missing data.
- **Image Handling**: Integration of country flags using `country-flag-icons` and high-quality portraits from Wikidata with alt tags.
- **Slug Optimization**: `createSlug` function handles Turkish characters correctly.

## External Dependencies
- **Wikidata SPARQL API**: Primary data source for famous individuals and their death details.
- **PostgreSQL (Neon)**: Relational database for storing application data.
- **country-flag-icons**: Library for displaying SVG country flags.
- **Google Analytics 4**: For website analytics (placeholders).
- **Google Search Console**: For website performance and indexing monitoring (placeholders).
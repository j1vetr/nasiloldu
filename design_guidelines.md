# Design Guidelines: nasiloldu.net

## Design Approach

**Selected System**: Material Design-inspired information architecture with Wikipedia-style content hierarchy, customized for the distinctive yellow-black brand palette.

**Rationale**: As an encyclopedia-style platform focused on biographical death information, the design must prioritize readability, credibility, and information density while maintaining the bold brand identity through strategic color use.

## Core Design Elements

### A. Color Palette

**Brand Colors**:
- Primary Yellow: 45 100% 52% (Sarı #FFD60A) - Headers, CTAs, accents, category badges
- Deep Black: 0 0% 0% (#000000) - Body text, backgrounds, navigation
- Background variations: 0 0% 5% (very dark gray for cards/sections)

**Neutral Scale** (for readability):
- Text on dark: 0 0% 95% (near-white for body text on black)
- Text on light: 0 0% 10% (near-black for readability)
- Border/dividers: 0 0% 20% (subtle dark gray)
- Muted text: 0 0% 60% (dates, metadata)

**Semantic Colors**:
- Success/Info: 45 95% 48% (darker yellow variant)
- Warning: 38 92% 50% (amber for alerts)
- Error: 0 84% 60% (red for critical info)

**Dark Mode Focus**: Primary interface is dark (black background with yellow accents). Maintain high contrast for accessibility.

### B. Typography

**Font Families**:
- Headings: 'Inter', sans-serif (weights: 600, 700) - modern, authoritative
- Body: 'Inter', sans-serif (weights: 400, 500) - excellent Turkish character support
- Data/Dates: 'Roboto Mono', monospace (weight: 400) - for dates and structured info

**Type Scale**:
- H1 (Page titles): text-4xl md:text-5xl font-bold
- H2 (Sections): text-2xl md:text-3xl font-semibold
- H3 (Subsections): text-xl md:text-2xl font-semibold
- Body: text-base md:text-lg leading-relaxed
- Metadata: text-sm text-gray-400
- Small/captions: text-xs

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistency.

**Container Strategy**:
- Max-width: max-w-7xl (main content)
- Reading width: max-w-3xl (article text)
- Card grid: max-w-6xl

**Grid Patterns**:
- Person cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Category badges: grid-cols-2 md:grid-cols-4 gap-4
- Related links: grid-cols-1 md:grid-cols-2 gap-3

### D. Component Library

**Navigation**:
- Top navbar: Black bg with yellow logo/active states, sticky position
- Breadcrumbs: Yellow arrows, muted gray text except current page
- Footer: Black bg, multi-column (Kategoriler, Hakkımızda, İletişim), yellow links on hover

**Person Cards**:
- Black card with 5% gray border
- Portrait image (square, 200x200px)
- Yellow name heading (h3)
- Gray metadata (meslek, doğum-ölüm tarihleri)
- Yellow category badge
- Subtle hover: border becomes yellow

**Detail Page Layout**:
- Hero: Person name (yellow h1) + portrait + key metadata in sidebar
- Info table: 2-column layout (label: value), yellow labels, white values
- Content sections: max-w-3xl, ample line-height
- Related persons: horizontal scroll cards on mobile, grid on desktop

**Category Badges**:
- Rounded pill shape (rounded-full)
- Yellow bg for active, yellow border/transparent for inactive
- Small text (text-xs), uppercase

**Search Bar**:
- Black input with yellow focus ring
- Yellow search icon/button
- Placeholder: "Bir ünlünün adını arayın..."

**Data Tables**:
- Striped rows (alternating 0% and 5% black)
- Yellow header row
- Minimal borders (gray-20%)

**CTA Buttons**:
- Primary: Yellow bg, black text, font-semibold, rounded-lg
- Secondary: Yellow border, yellow text, transparent bg
- Ghost: Yellow text, no border, hover yellow/10% bg

### E. Page-Specific Patterns

**Homepage**:
- Hero section: Yellow gradient overlay text on dark, "Ünlüler Nasıl Öldü?" 
- "Bugün Ölenler" section: Horizontal timeline with dates
- "En Çok Arananlar": 3-column grid of cards
- Category explorer: 4 large yellow category tiles with icons
- Recent additions: List view with small thumbnails

**Person Detail Page** (/nasil-oldu/<slug>):
- Two-column layout: Main content (2/3) + Sidebar (1/3)
- Sidebar: Portrait, infobox (doğum/ölüm tarihi, yer, neden, meslek, ülke)
- Main: Opening paragraph (bold first sentence), chronological sections
- Bottom: "İlgili Kişiler" grid (6 cards minimum)
- Schema.org Person markup visible in source

**Category Pages** (/kategori/<tip>):
- Category header with icon and count
- Filter sidebar: Ülke, Meslek, Yıl filters
- Grid of filtered person cards
- Pagination (yellow active page)

**Search Results** (/ara):
- Search query displayed prominently
- Results count in yellow
- List view (more detailed than cards)
- No results: Yellow info box with suggestions

### F. Imagery

**Person Portraits**:
- Square aspect ratio (1:1), lazy loaded
- Default placeholder: Yellow silhouette icon on black
- Alt text: "[Kişi adı] portresi"

**Category Icons**:
- Use Font Awesome or Heroicons
- Medical cross (Hastalık), car (Kaza), broken heart (İntihar), target (Suikast)
- Yellow color, 32x32px minimum

**No Hero Images**: Homepage uses text-focused hero with yellow gradient overlay on dark background instead of photos.

### G. Accessibility

**Contrast**: Yellow on black = 9.8:1 (AAA), white text on black = 21:1 (AAA)
**Focus States**: 2px yellow ring (ring-2 ring-yellow-400)
**Keyboard Nav**: Tab order follows reading flow, skip-to-content link
**Screen Readers**: Semantic HTML, ARIA labels for icons, lang="tr" attribute

### H. Animations

**Minimal, Purposeful Only**:
- Page transitions: None (faster SSR experience)
- Hover effects: Subtle scale (scale-105) on cards, 200ms duration
- Loading states: Yellow spinner or skeleton screens
- No scroll-triggered animations

### I. SEO Visual Elements

**Breadcrumbs**: Always visible below navbar, yellow dividers
**Related Links Section**: Visually distinct (yellow border-l-4), bottom of every person page
**Schema Markup**: Not visible but structured as table-like infobox

### J. Mobile Considerations

**Responsive Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
**Mobile Nav**: Hamburger menu (yellow icon), full-screen overlay
**Touch Targets**: Minimum 44x44px for buttons/links
**Card Stacking**: All grids collapse to single column on mobile
**Sidebar**: Moves below main content on mobile

---

**Design Philosophy**: Create a credible, Wikipedia-like information authority with the bold yellow-black brand making it distinctive. Information density and readability trump visual flair. Every design decision supports fast SSR load times and Google crawlability.
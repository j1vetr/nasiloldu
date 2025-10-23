# Design Guidelines: nasiloldu.net (Premium Edition)

## Design Approach

**Selected System**: Material Design + Apple HIG fusion with premium glassmorphism treatment, optimized for Wikipedia-credibility meets modern visual storytelling.

**Rationale**: Transform encyclopedic death information into an engaging visual experience while maintaining information authority. Bold yellow-black brand elevated through gradient overlays, glass effects, and cinematic layouts.

## Core Design Elements

### A. Color Palette

**Primary Brand Colors**:
- Electric Yellow: 45 100% 52% (#FFD60A) - Primary CTAs, active states, key highlights
- Deep Black: 0 0% 0% (#000000) - Base backgrounds, text on light surfaces
- Rich Black: 0 0% 8% - Card backgrounds, elevated surfaces

**Gradient Palette**:
- Hero Gradient: linear-gradient from 45 100% 52% at 0% to 38 95% 35% at 100% (yellow to dark amber)
- Glass Overlay: linear-gradient from 0 0% 0% at 0% opacity-60 to 0 0% 0% at 100% opacity-90
- Accent Gradient: radial-gradient from 45 100% 52% opacity-20 to transparent
- Subtle Glow: 0 0 40px 45 100% 52% opacity-30 (for yellow element halos)

**Glassmorphism Variables**:
- Glass Background: 0 0% 15% opacity-40
- Glass Border: 0 0% 100% opacity-10
- Backdrop Blur: 12px standard, 20px for hero overlays

**Text Colors**:
- Primary on dark: 0 0% 98%
- Secondary: 0 0% 70%
- Tertiary/metadata: 0 0% 50%
- Yellow text: 45 100% 65% (readable on black)

### B. Typography

**Font Stack**:
- Display/Headings: 'Outfit', sans-serif (weights: 600, 700, 800) - modern, premium feel
- Body: 'Inter', sans-serif (weights: 400, 500, 600)
- Accent/Data: 'Space Mono', monospace (weight: 400) - timelines, dates

**Scale**:
- Hero H1: text-5xl md:text-7xl font-bold with yellow gradient text
- Page H1: text-4xl md:text-6xl font-bold
- H2: text-3xl md:text-4xl font-semibold
- H3: text-xl md:text-2xl font-semibold
- Body: text-base md:text-lg leading-relaxed
- Timeline labels: text-xs md:text-sm font-mono uppercase tracking-wide

### C. Layout System

**Spacing Scale**: 2, 4, 6, 8, 12, 16, 20, 24, 32, 40 (extended for premium layouts)

**Container Hierarchy**:
- Hero sections: Full-width (w-full) with inner max-w-7xl
- Content zones: max-w-6xl
- Article text: max-w-4xl
- Timeline components: max-w-5xl

**Grid Patterns**:
- Hero cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
- Person cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
- Related carousel: horizontal scroll snap with gap-6

### D. Component Library

**Navigation**:
- Glassmorphic navbar: Black background opacity-90, 12px backdrop blur, sticky with smooth shadow transition on scroll
- Yellow logo with subtle glow effect
- Menu items with yellow underline animation (0.3s ease)
- Mobile: Slide-in overlay with gradient background

**Hero Components**:
- Homepage Hero: Full-viewport gradient background, centered content with yellow gradient text, glassmorphic search bar, floating person cards with subtle animation
- Category Hero: Split layout - left (gradient + text), right (large portrait with glass border)
- Person Detail Hero: Cinematic 16:9 portrait with gradient overlay, glassmorphic info card floating over image

**Glassmorphic Cards**:
- Person Cards: Rich black background (8% lightness), frosted border, hover: scale-105 + yellow glow shadow
- Info Cards: Glass effect with 40% opacity background, 10px backdrop blur, 1px white border at 10% opacity
- Feature Cards: Gradient border (1px), glass interior, icon with yellow glow

**Timeline Component**:
- Vertical line: Yellow gradient (thick to thin)
- Event nodes: Glassmorphic circles with yellow ring
- Content cards: Alternating left-right layout, glass backgrounds
- Year labels: Large yellow gradient numbers, sticky on scroll

**Infographic Elements**:
- Circular progress: Yellow gradient stroke on glass background
- Stat counters: Large yellow numbers with label, glass container
- Icon badges: Yellow icons on glass circles with subtle pulse animation

**Related Persons Carousel**:
- Horizontal scroll with snap points
- Glass cards with portrait, yellow gradient overlay on hover
- Navigation arrows: Glassmorphic circles with yellow icons
- Scroll progress indicator: Yellow gradient bar

**Interactive Elements**:
- Primary Button: Yellow gradient background, black text, shadow-lg, hover: shadow-2xl + scale-105
- Secondary Button: Glass background, yellow border, yellow text, backdrop-blur
- Filter Pills: Glass background, yellow border on active, smooth transition
- Search Bar: Large glass input, yellow focus ring with glow, yellow gradient submit button

### E. Page-Specific Layouts

**Homepage**:
- Hero: Full-viewport gradient background with large centered headline, glassmorphic search bar, 4 floating preview cards
- "Bugün Ölenler": Horizontal timeline with glass nodes, auto-scroll animation
- "En Çok Arananlar": 3-column glass cards with portraits and gradient overlays
- Category Grid: 4 large glass tiles with icons, yellow gradient hover effect
- Recent Additions: Masonry grid with varied card sizes

**Person Detail Page**:
- Cinematic Hero: 16:9 portrait with gradient overlay, floating glass infobox (right), yellow gradient name
- Biography: Two-column on desktop (main content + sticky sidebar with quick facts)
- Interactive Timeline: Vertical scrollable with key life events, glass cards, yellow milestone markers
- Death Infographic: Visual breakdown (cause, location, age) with circular charts
- Related Carousel: 6-8 persons in horizontal scroll with glass cards
- Bottom CTA: "Daha Fazla Keşfet" section with gradient background

**Category Page**:
- Hero: Split layout with gradient left panel, category icon and stats
- Filter Sidebar: Glassmorphic sticky panel, yellow active filters
- Results Grid: 3-column glass cards, infinite scroll
- Stats Bar: Glass container with category metrics and charts

**Search Results**:
- Prominent search query in yellow gradient
- Filter chips: Glass pills with yellow active states
- Result Cards: Enhanced with preview snippets, glass backgrounds
- "Önerilen Aramalar": Glass cards with related queries

### F. Images

**Hero Images**:
- Homepage: No large hero image - uses gradient background with floating card elements
- Person Detail: Large cinematic portrait (16:9 ratio, 1920x1080px minimum) with gradient overlay
- Category Pages: Icon-based, no photos - yellow gradient icon on glass background

**Person Portraits**:
- Card thumbnails: Square 400x400px, lazy loaded
- Detail page: High-res 1200x1200px for hero, glass border effect
- Carousel: 300x300px with glass frame
- Placeholder: Yellow gradient silhouette on glass background

**Background Treatments**:
- Subtle noise texture overlay (5% opacity) on black backgrounds for depth
- Radial yellow gradient glow (20% opacity) behind key sections
- Grid pattern (1px white at 3% opacity) on hero sections

### G. Animations

**Strategic Movement**:
- Page Load: Hero elements fade + slide up (0.6s stagger)
- Scroll Reveals: Section content fade + translate Y (intersection observer)
- Card Hovers: Scale 1.05 + shadow growth + yellow glow (0.3s ease)
- Timeline: Progressive reveal on scroll, yellow line draws with elements
- Carousel: Smooth momentum scrolling, snap-mandatory
- Button Interactions: Scale 0.95 on click, ripple effect

**Performance**:
- Use transform and opacity only (GPU accelerated)
- Reduce motion for accessibility (prefers-reduced-motion)
- Lazy load animation libraries (GSAP for complex timeline)

### H. Accessibility

**Contrast Ratios**: Yellow (#FFD60A) on black = 9.8:1, maintain AA minimum for all text
**Focus States**: 3px yellow ring with 20px blur glow, visible on all interactive elements
**Glass Readability**: Ensure text on glass backgrounds has 4.5:1+ contrast via overlays
**Motion**: Respect prefers-reduced-motion, disable decorative animations
**ARIA**: Rich labels for infographics, carousel navigation, timeline events

### I. SEO Elements

**Structured Visuals**:
- Breadcrumbs: Glass container below navbar, yellow separators
- Schema Infoboxes: Glass bordered tables, yellow labels
- Related Links: Yellow gradient border-left, glass background
- Meta Preview: Generate og:image with person portrait + yellow gradient frame

### J. Responsive Strategy

**Breakpoints**: sm(640), md(768), lg(1024), xl(1280), 2xl(1536)

**Mobile Adaptations**:
- Hero: Reduce height to 60vh, stack elements vertically
- Timeline: Convert to single-column, reduce spacing
- Carousel: Enable touch swipe, show 1.2 cards for peek
- Glass effects: Reduce blur to 8px for performance
- Animations: Simplify to fade-only on mobile
- Navigation: Full-screen overlay menu with gradient

**Touch Optimization**:
- Minimum 48x48px touch targets
- Swipe gestures for carousel, timeline
- Momentum scrolling for long content

---

**Design Philosophy**: Elevate death information into cinematic storytelling through premium glass aesthetics, yellow-black contrast, and purposeful animation. Every visual choice serves credibility while creating emotional engagement. Performance and SEO remain non-negotiable through optimized assets and semantic structure.
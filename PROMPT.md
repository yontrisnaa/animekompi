# Prompt: Build Anime Streaming Website

Build a complete anime streaming website with the following specifications:

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI

## API Integration
**Base URL**: `https://zeldvorik.ru/animekompi/endpoints`

Use the following API endpoints:
- Homepage: `GET https://zeldvorik.ru/animekompi/endpoints/home.php?page={page}`
- Detail: `GET https://zeldvorik.ru/animekompi/endpoints/detail.php?slug={slug}`
- Watch: `GET https://zeldvorik.ru/animekompi/endpoints/watch.php?slug={slug}`
- Schedule: `GET https://zeldvorik.ru/animekompi/endpoints/schedule.php`
- Batch: `GET https://zeldvorik.ru/animekompi/endpoints/batch.php?page={page}`
- Search: `GET https://zeldvorik.ru/animekompi/endpoints/search.php?q={query}&page={page}`

**API Response Format:**
All endpoints return JSON with this structure:
```json
{
  "status": "success",
  "data": {
    // Response data here
  }
}
```

**Implementation in lib/api.ts:**
```typescript
const BASE_URL = 'https://zeldvorik.ru/animekompi/endpoints';

async function fetchAPI<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }
    
    const res = await fetch(url.toString(), {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    
    if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
    }
    
    return res.json();
}

export async function getHome(page: number = 1): Promise<HomeResponse> {
    return fetchAPI<HomeResponse>('/home.php', { page: page.toString() });
}

export async function getDetail(slug: string): Promise<DetailResponse> {
    return fetchAPI<DetailResponse>('/detail.php', { slug });
}

export async function getWatch(slug: string): Promise<WatchResponse> {
    return fetchAPI<WatchResponse>('/watch.php', { slug });
}

export async function getSchedule(): Promise<ScheduleResponse> {
    return fetchAPI<ScheduleResponse>('/schedule.php');
}

export async function search(query: string, page: number = 1): Promise<SearchResponse> {
    return fetchAPI<SearchResponse>('/search.php', { q: query, page: page.toString() });
}

export async function getBatch(page: number = 1): Promise<BatchResponse> {
    return fetchAPI<BatchResponse>('/batch.php', { page: page.toString() });
}
```

## Core Features

### 1. Homepage
- Hero slider with top 5 trending anime (auto-play carousel)
- Infinite scroll grid for latest anime updates
- Responsive card design with hover effects
- Click on hero slider navigates to anime detail or watch page (smart routing based on slug)

### 2. Anime Detail Page
- **Mobile Layout**: Horizontal card with thumbnail and info side-by-side
- **Desktop Layout**: Vertical sidebar with thumbnail and info card
- Display: title, synopsis, genres, status, studio, type, season
- Episode list with search functionality
- "Watch Latest Episode" button
- All content visible on both mobile and desktop

### 3. Watch/Player Page
- Video player with iframe embed
- Multiple streaming server options
- Download links with quality badges (480p, 720p, etc.)
- **Navigation buttons** (Previous/Episode List/Next) positioned **directly below video**, **centered**
- Breadcrumb navigation
- Episode navigation with prev/next detection

### 4. Schedule Page
- Weekly anime schedule
- Days sorted starting from current day
- "Today" badge on current day
- Anime cards grouped by day

### 5. Batch Page
- Grid of completed anime for batch download
- Infinite scroll pagination
- Deduplication to prevent duplicate entries

### 6. Search Page
- Search bar in navbar
- Results grid with infinite scroll
- Deduplication logic
- Empty state handling

### 7. SEO Optimization
- Static metadata in root layout
- Dynamic metadata per page using generateMetadata()
- Open Graph tags for social sharing
- Twitter Card tags
- JSON-LD structured data for anime (TVSeries schema)
- robots.txt
- sitemap.xml
- Canonical URLs
- Proper heading hierarchy (H1, H2, etc.)

## Design Requirements

### Color Scheme
- Background: slate-950
- Cards: slate-900 with transparency
- Primary: blue-600
- Accent: cyan-400
- Text: white/gray-400

### Components
- Glassmorphism effects on cards
- Smooth hover animations
- Loading skeletons
- Responsive grid layouts
- Mobile-first design

### Navigation
- Sticky navbar with logo, menu items, and search
- Footer with copyright and Histats analytics script

## Key Implementation Details

### 1. Infinite Scroll
- Use Intersection Observer API
- Load more when user scrolls to bottom
- Show loading indicator
- Deduplication using Set to track slugs
- Stop loading when no new unique items or no more pages

### 2. Hero Slider
- Auto-play with 5-second interval
- Pause on hover
- Click entire slide to navigate
- Smart routing: detect episode slug vs anime slug
- Show "Watch Now" or "View Details" based on slug type

### 3. Episode Detection
Create utility function to detect episode slugs:
```typescript
export function isEpisodeSlug(slug: string): boolean {
  return /episode-\d+/.test(slug);
}
```

### 4. Responsive Layout
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
- Use Tailwind breakpoints: sm, md, lg, xl

## File Structure
```
app/
├── layout.tsx (root layout with SEO)
├── page.tsx (homepage)
├── anime/[slug]/page.tsx (detail page)
├── watch/[slug]/page.tsx (player page)
├── schedule/page.tsx
├── batch/page.tsx
├── search/page.tsx
├── robots.ts
└── sitemap.ts

components/
├── navbar.tsx
├── footer.tsx
├── hero-slider.tsx
├── anime-card.tsx
├── video-player.tsx
├── episode-list.tsx
├── infinite-anime-grid.tsx
├── infinite-batch-grid.tsx
└── infinite-search-grid.tsx

lib/
├── api.ts (API client functions)
├── types.ts (TypeScript interfaces)
└── utils-episode.ts (Episode utilities)
```

## Analytics Integration
Add Histats tracking script in footer:
```html
<script type="text/javascript">
var _Hasync= _Hasync|| [];
_Hasync.push(['Histats.start', '1,4981556,4,0,0,0,00010000']);
_Hasync.push(['Histats.fasi', '1']);
_Hasync.push(['Histats.track_hits', '']);
(function() {
var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
hs.src = ('//s10.histats.com/js15_as.js');
(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
})();
</script>
```

## Installation Steps

1. Create Next.js project:
```bash
npx create-next-app@latest animekompi --typescript --tailwind --app
cd animekompi
```

2. Install dependencies:
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input
npm install lucide-react
```

3. Run development server:
```bash
npm run dev
```

## Important Notes

1. **Navigation Button Position**: Must be directly below video embed, centered, before title and other sections
2. **Deduplication**: Essential for infinite scroll to prevent duplicates
3. **Smart Routing**: Hero slider must detect episode vs anime slugs
4. **Mobile Layout**: Detail page must use horizontal card on mobile
5. **Schedule Sorting**: Must start from current day with "Today" badge
6. **Episode List**: Must include search functionality
7. **Responsive Design**: Test on mobile, tablet, and desktop
8. **Loading States**: Show skeletons while data is loading
9. **SEO**: Hardcoded in layout.tsx, dynamic per page using generateMetadata()
10. **Vercel Deployment**: No database needed, fully serverless

## Testing Checklist

- [ ] Homepage loads with hero slider and infinite scroll
- [ ] Hero slider auto-plays and navigates correctly
- [ ] Detail page shows correct layout on mobile and desktop
- [ ] Watch page has navigation buttons centered below video
- [ ] Schedule starts from current day
- [ ] Batch page infinite scroll works without duplicates
- [ ] Search returns results with infinite scroll
- [ ] SEO metadata appears in page source
- [ ] robots.txt and sitemap.xml are accessible
- [ ] All pages are responsive
- [ ] No console errors
- [ ] Deploys successfully to Vercel

## Success Criteria

✅ All pages render correctly
✅ Infinite scroll works on all applicable pages
✅ SEO is properly implemented
✅ Mobile responsive design works perfectly
✅ Navigation and routing work as expected
✅ No duplicate data in infinite scroll
✅ Analytics tracking is active
✅ Successfully deploys to Vercel

---

**Build this exactly as specified and you will have a production-ready anime streaming website!**

## Live Demo
- **Production**: https://animekompi.vercel.app
- **GitHub**: https://github.com/yontrisnaa/animekompi

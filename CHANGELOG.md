# Changelog

## [7.0.0] - 2026-06-13

### Changed (BREAKING)
- All API routes now under `/api/v1/` prefix (e.g., `/api/v1/manga`, `/api/v1/chapter/:chapterId`)
- Response envelope: `{ success: true, data, pagination }` on all endpoints
- Chapter endpoint now uses `chapterId` parameter: `/api/v1/chapter/:chapterId`
- Manga detail and chapters endpoints now use `/api/posts` for richer data (alternativeTitles, totalViews, releaseDate, etc.)
- Search now uses server-side `/api/posts?search=` instead of client-side filtering
- Genres now fetched from upstream `/api/genres` directly (65 genres)
- Rate limiting increased to 60 req/min with proper headers

### Added
- `/api/v1/health` — Health check with upstream probe and latency tracking
- `/api/v1/stats` — API statistics, endpoint listing, and version info
- `/api/v1/collections` — All curated manga collections
- `/api/v1/collections/:slug` — Collection detail with works and tags
- `/api/v1/teams` — All scanlation teams with pagination
- `/api/v1/manga/:slug/chapters` — RESTful alias for chapter listing
- Pagination headers: `X-Pagination-Total`, `X-Pagination-Per-Page`, `X-Pagination-Current-Page`, `X-Pagination-Last-Page`, `X-Pagination-Has-Next`, `X-Pagination-Has-Previous`
- Rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`
- Legacy redirects from old `/api/*` routes to new `/api/v1/*` routes
- Collection and team controllers
- Upstream fetch helpers: `fetchQuery`, `fetchPosts`, `fetchGenres`, `fetchCollections`, `fetchCollectionDetail`, `fetchTeams`

### Fixed
- Chapter images endpoint now returns actual page images using `/api/chapter?chapterId=` (was broken with slug params)
- Input validation: `page` clamped to >= 1, `limit` clamped to 1-100
- Removed unused `transformMangaDetail` and `transformMangaList` exports
- Genres endpoint now returns all 65 genres from upstream API

## [6.2.0] - 2026-06-13

### Fixed
- Chapter images endpoint now returns actual page images (was returning 0)
- Replaced broken HTML scraping with upstream `/api/chapter` API endpoint
- Input validation: `page` clamped to >= 1, `limit` clamped to 1-100 range
- Negative page values no longer crash with upstream 500 error
- Limit > 100 no longer crashes with upstream 502 error

### Changed
- Chapter controller now uses `fetchChapter()` from upstream API instead of scraping vortexscans.org HTML
- Added `VORTEX_CHAPTER` constant for `/api/chapter` endpoint
- Added `fetchChapter()` function in fetch helper
- Removed unused `transformMangaDetail` export from manga extractor

## [6.1.0] - 2026-06-11

### Fixed
- Chapter navigation regex now matches `aria-label="Prev"` / `aria-label="Next"` instead of text content
- Search endpoint now performs client-side filtering (upstream API ignores `search` param)
- Genre filter now performs client-side filtering (upstream API ignores `genre` param)
- Removed duplicate `/docs` route in server.js
- Fixed double-wrapping of `success` field in JSON responses
- Fixed variable name collision in search controller (`query` → `searchQuery`)

### Changed
- `jsonResponse()` now checks if data already has `success` field to prevent double-wrapping
- Search fetches full manga list (360) and filters locally by title
- Genre filter fetches full manga list (360) and filters locally by genre ID

## [6.0.0] - 2026-06-11

### Changed
- Converted from Vercel Serverless Functions to Express server.js
- Single server.js entry point (matching MiruroAPI architecture)
- Added CORS middleware with unified origin handling
- Added security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Added rate limiting (100 requests per minute per IP)
- Simplified vercel.json to 2 routes
- Added express and cors dependencies
- Added `npm start` script for local development

## [5.0.0] - 2026-06-11

### Added
- `docs/index.md` - Overview, quick start, features
- `docs/endpoints.md` - Full API reference (10 endpoints)
- `docs/examples.md` - cURL, JavaScript, Python examples
- `docs/architecture.md` - Project structure and design decisions

## [4.0.0] - 2026-06-11

### Added
- `public/index.html` - Full landing page with hero, features, endpoint explorer, playground
- `public/404.html` - Custom 404 error page with glitch animation
- `public/docs.html` - Swagger UI interactive documentation
- `public/privacy.html` - Privacy policy page
- `public/tos.html` - Terms of service page
- `public/openapi.json` - OpenAPI 3.0.3 specification
- `public/robots.txt` - SEO crawl rules
- `public/sitemap.xml` - XML sitemap for search engines
- `public/manifest.json` - PWA manifest

### Changed
- Updated `vercel.json` to serve static files from public directory
- Added static file routes for docs, privacy, tos, sitemap, robots, openapi

## [3.1.0] - 2026-06-11

### Changed
- Refactored all source files to match MiruroAPI code style
- Added box-style file headers with repository link and author info
- Added section headers (═══) for code organization
- Added feature markers (// ---- FEATURE:) for each function
- Added JSDoc function-level documentation with @param, @returns, @example
- Added inline notes (// NOTE:) for implementation details
- Added file footer markers (// ═══ END: filename)

## [3.0.0] - 2026-06-11

### Added
- `/api/home` - Home page data (latest, hot, top rated, genres)
- `/api/chapter?slug=&chapter=` - Chapter images + navigation
- `/api/manga/{slug}/chapters` - All chapters for a manga
- `/api/search?q=keyword` - Search manga by keyword
- `/api/filter?type=&status=&genre=` - Filter manga
- `/api/genres` - All available genres
- `/api/status` - Statuses, types, sort options
- `/api/manga/{slug}` - Manga detail with chapters
- `/api/manga` - List all manga
- In-memory TTL caching (5min-24hr depending on endpoint)
- Chapter images extraction from HTML
- Chapter navigation (prev/next)
- CORS headers on all endpoints

## [2.0.0] - 2026-06-11

### Added
- `src/controllers/` - Route handler logic
- `src/extractors/` - Data transformation logic
- `src/helpers/cache.helper.js` - In-memory Map with TTL caching
- `src/helpers/constants.helper.js` - Cache TTL configurations
- Auto-cleanup of expired cache entries every 60 seconds

## [1.1.0] - 2026-06-11

### Changed
- Refactored from Next.js to pure Vercel Serverless Functions

## [1.0.0] - 2026-06-11

### Added
- Initial release

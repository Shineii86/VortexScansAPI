# Changelog

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

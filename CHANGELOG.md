# Changelog

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

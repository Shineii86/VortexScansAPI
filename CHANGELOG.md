# Changelog

## [2.0.0] - 2026-06-11

### Added
- `src/controllers/` - Route handler logic (manga, genres, status, index)
- `src/extractors/` - Data transformation logic
- `src/helpers/cache.helper.js` - In-memory Map with TTL caching
- `src/helpers/constants.helper.js` - Cache TTL configurations
- Auto-cleanup of expired cache entries every 60 seconds

### Changed
- Refactored to controllers/extractors/helpers architecture
- Manga list cached for 5 minutes
- Manga detail cached for 5 minutes
- Genres cached for 1 hour
- Status cached for 24 hours
- Improved code organization and separation of concerns

## [1.1.0] - 2026-06-11

### Changed
- Refactored from Next.js to pure Vercel Serverless Functions
- Removed Next.js dependency and framework overhead
- Simplified project structure to `api/` folder
- Faster cold starts and smaller bundle size

## [1.0.0] - 2026-06-11

### Added
- Initial release of VortexScans API
- `/api/manga` - List all manga with pagination, filtering, and search
- `/api/manga/{slug}` - Get detailed manga info with chapter list
- `/api/genres` - Get all available genres
- `/api/status` - Get available statuses and types
- Search functionality via `?search=` parameter
- Filter by type (manhwa, manga, manhua)
- Filter by status (ongoing, hiatus, completed)
- Filter by genre
- Sort by various fields
- CORS support for cross-origin requests
- Documentation endpoint at `/api`
- Comprehensive README with API documentation

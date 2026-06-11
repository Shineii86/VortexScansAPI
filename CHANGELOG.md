# Changelog

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
- Response caching (5 minutes for manga, 1 hour for genres)
- Next.js App Router architecture
- Vercel deployment ready
- Documentation homepage at `/`
- Comprehensive README with API documentation

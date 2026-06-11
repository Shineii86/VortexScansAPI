# VortexScans API

Unofficial REST API for [Vortex Scans](https://vortexscans.org).  
**355+ manga** with chapter images, search, filters, and more.

## Base URL

```
https://vortex-scans-api.vercel.app/api
```

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/home` | Home page data (latest, hot, top rated) |
| `GET /api/manga` | List all manga |
| `GET /api/manga/{slug}` | Manga detail |
| `GET /api/manga/{slug}/chapters` | All chapters |
| `GET /api/chapter?slug=&chapter=` | Chapter images |
| `GET /api/search?q=keyword` | Search manga |
| `GET /api/filter?type=&status=&genre=` | Filter manga |
| `GET /api/genres` | All genres |
| `GET /api/status` | Statuses & types |

## Examples

```bash
# List manga
curl "https://vortex-scans-api.vercel.app/api/manga?page=1&limit=10"

# Search
curl "https://vortex-scans-api.vercel.app/api/search?q=reality"

# Manga detail
curl "https://vortex-scans-api.vercel.app/api/manga/reality-quest-2"

# Chapter images
curl "https://vortex-scans-api.vercel.app/api/chapter?slug=reality-quest-2&chapter=chapter-209"

# Filter
curl "https://vortex-scans-api.vercel.app/api/filter?type=manhwa&status=ongoing"

# Home
curl "https://vortex-scans-api.vercel.app/api/home"
```

## Response Format

```json
{
  "success": true,
  "data": [...],
  "pagination": { "page": 1, "limit": 48, "total": 355, "totalPages": 8 }
}
```

## Chapter Images Response

```json
{
  "success": true,
  "manga": { "slug": "reality-quest-2" },
  "chapter": {
    "slug": "chapter-209",
    "title": "Reality Quest Chapter 209",
    "images": [
      { "page": 1, "url": "https://storage.vortexscans.org/..." }
    ],
    "totalPages": 38,
    "navigation": {
      "prev": { "slug": "chapter-208" },
      "next": null
    }
  }
}
```

## Cache

| Endpoint | TTL |
|----------|-----|
| Manga list/detail | 5 min |
| Chapter images | 30 min |
| Genres | 1 hour |
| Status | 24 hours |

## License

MIT — Made by **Shineii86**

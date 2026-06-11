# Architecture

## Project Structure

```
VortexScansAPI/
├── api/                              # Vercel Serverless Functions
│   ├── index.js                      # GET /api — API info endpoint
│   ├── home.js                       # GET /api/home — Home page data
│   ├── manga.js                      # GET /api/manga — List, detail, chapters
│   ├── chapter.js                    # GET /api/chapter — Chapter images
│   ├── search.js                     # GET /api/search — Search manga
│   ├── filter.js                     # GET /api/filter — Advanced filter
│   ├── genres.js                     # GET /api/genres — All genres
│   └── status.js                     # GET /api/status — Statuses, types
│
├── src/
│   ├── controllers/                  # Business logic
│   │   ├── info.controller.js        # API info response
│   │   ├── home.controller.js        # Home page aggregation
│   │   ├── manga.controller.js       # Manga list/detail/chapters
│   │   ├── chapter.controller.js     # Chapter image extraction
│   │   ├── search.controller.js      # Search logic
│   │   ├── filter.controller.js      # Filter logic
│   │   └── genre.controller.js       # Genres + status metadata
│   │
│   ├── extractors/                   # Data transformation
│   │   ├── manga.extractor.js        # Transform manga/chapter objects
│   │   └── chapter.extractor.js      # Extract images from HTML
│   │
│   └── helpers/                      # Shared utilities
│       ├── cache.helper.js           # In-memory Map with TTL cache
│       ├── constants.helper.js       # Cache TTLs, base URLs
│       └── fetch.helper.js           # Vortex API fetch wrapper
│
├── public/                           # Static files
│   ├── index.html                    # Landing page
│   ├── 404.html                      # Error page
│   ├── docs.html                     # Swagger UI
│   ├── openapi.json                  # OpenAPI 3.0.3 spec
│   ├── manifest.json                 # PWA manifest
│   ├── robots.txt                    # SEO crawl rules
│   ├── sitemap.xml                   # XML sitemap
│   ├── privacy.html                  # Privacy policy
│   ├── tos.html                      # Terms of service
│   ├── icon.svg                      # SVG icon
│   ├── icon-512x512.png             # PWA icon
│   ├── favicon.ico                   # Favicon
│   ├── apple-touch-icon-180x180.png  # iOS icon
│   └── og-image.png                  # OG/Twitter share image
│
├── docs/                             # API documentation
│   ├── index.md                      # Overview, quick start
│   ├── endpoints.md                  # Full API reference
│   ├── examples.md                   # cURL, JavaScript, Python
│   └── architecture.md               # This file
│
├── vercel.json                       # Vercel routing config
├── package.json                      # name: "vortexscans-api"
├── CHANGELOG.md                      # Version history
├── README.md                         # Full API documentation
└── LICENSE                           # MIT License
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Vercel Serverless Functions (no Express) |
| Metadata | Vortex Scans API (`api.vortexscans.org/api/query`) |
| Images | Vortex Scans HTML scraping (`vortexscans.org`) |
| Deployment | Vercel (Hobby tier) |
| Caching | In-memory Map with 5-30 min TTL |
| Static Files | Vercel static hosting (`public/`) |

## Request Flow

```
Client Request
    ↓
Vercel Routes (/api/* → serverless functions)
    ↓
API Handler (e.g., manga.js)
    ↓
Controller (e.g., manga.controller.js)
    ↓
Helper (e.g., fetch.helper.js)
    ↓
HTTP Request to Vortex Scans API / HTML page
    ↓
Extractor (e.g., manga.extractor.js or chapter.extractor.js)
    ↓
Returns structured JSON
    ↓
Client Response
```

## Image Extraction Flow

```
/api/chapter?slug={slug}&chapter={chapter}
    ↓
Fetch HTML from vortexscans.org/series/{slug}/{chapter}
    ↓
Extract image URLs via regex on storage.vortexscans.org URLs
    ↓
Deduplicate and return ordered page images
    ↓
Response with images[] + navigation (prev/next)
```

## Caching Strategy

- **Type:** In-memory Map
- **TTL:** 5-30 minutes depending on endpoint
- **Max Size:** Unbounded (Vercel hobby tier has limited memory)
- **Key:** Deterministic from request parameters
- **Behavior:** First request fetches from source, subsequent requests served from cache
- **Eviction:** Automatic when TTL expires (lazy eviction on access)
- **Cleanup:** Automatic every 60 seconds

### Cache TTL Configuration

| Data Type | TTL | Reason |
|-----------|-----|--------|
| Manga List | 5 minutes | Lists update frequently |
| Manga Detail | 5 minutes | Detail changes with new chapters |
| Chapter Images | 30 minutes | Images are immutable |
| Genres | 1 hour | Genres rarely change |
| Status | 24 hours | Status types are static |

## Data Sources

### Vortex Scans API

- **Endpoint:** `https://api.vortexscans.org/api/query`
- **Data:** Manga listings, search, metadata, genres
- **Format:** JSON
- **Parameters:** page, perPage, search, seriesType, seriesStatus, genre, orderBy, orderDirection, hot

### Vortex Scans Website (HTML Scraping)

- **Endpoint:** `https://vortexscans.org/series/{slug}/{chapter}`
- **Data:** Chapter page images
- **Format:** HTML with image URLs from storage CDN
- **Pattern:** `https://storage.vortexscans.org/upload/series/{slug}/{chapter-id}/page-{num}_{ts}-{hash}.webp`

## Vercel Configuration

```json
{
  "version": 2,
  "public": true,
  "routes": [
    { "src": "/api/home", "dest": "/api/home.js" },
    { "src": "/api/manga", "dest": "/api/manga.js" },
    { "src": "/api/chapter", "dest": "/api/chapter.js" },
    { "src": "/api/search", "dest": "/api/search.js" },
    { "src": "/api/filter", "dest": "/api/filter.js" },
    { "src": "/api/genres", "dest": "/api/genres.js" },
    { "src": "/api/status", "dest": "/api/status.js" },
    { "src": "/api", "dest": "/api/index.js" },
    { "src": "/(.*)", "dest": "/public/$1" }
  ]
}
```

- `/api/*` routes to serverless functions for API handling
- `/*` routes to static files from `public/`

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error description"
}
```

## Dependencies

This project has **zero dependencies** — it uses only built-in Node.js modules and the global `fetch` API available in Node.js 18+.

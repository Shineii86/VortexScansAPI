# Architecture

## Project Structure

```
VortexScansAPI/
├── server.js                          # Express entry point, port 3000
├── package.json                       # name: "vortexscans-api"
├── vercel.json                        # Routes /api/* and /* to server.js
│
├── public/                            # Static files served from process.cwd()
│   ├── index.html                     # Landing page (hero, features, playground)
│   ├── docs.html                      # Swagger UI interactive documentation
│   ├── openapi.json                   # OpenAPI 3.0.3 spec
│   ├── 404.html                       # Glitch animation error page
│   ├── manifest.json                  # PWA manifest (theme: #38bdf8)
│   ├── robots.txt                     # Crawler directives
│   ├── sitemap.xml                    # 4 pages (/, /tos, /privacy, /api)
│   ├── icon.svg                       # SVG icon
│   ├── icon-512x512.png              # PWA icon
│   ├── favicon.ico                    # Classic favicon
│   ├── apple-touch-icon-180x180.png  # iOS home screen icon
│   ├── og-image.png                   # OG/Twitter share image
│   ├── privacy.html                   # Privacy policy (served at /privacy)
│   └── tos.html                       # Terms of service (served at /tos)
│
├── src/
│   ├── controllers/
│   │   ├── info.controller.js         # API info response
│   │   ├── home.controller.js         # Home page aggregation
│   │   ├── manga.controller.js        # Manga list/detail/chapters
│   │   ├── chapter.controller.js      # Chapter image extraction
│   │   ├── search.controller.js       # Search logic
│   │   ├── filter.controller.js       # Filter logic
│   │   └── genre.controller.js        # Genres + status metadata
│   │
│   ├── extractors/
│   │   ├── manga.extractor.js         # Transform manga/chapter objects
│   │   └── chapter.extractor.js       # Extract images from HTML
│   │
│   └── helpers/
│       ├── cache.helper.js            # In-memory Map with TTL cache
│       ├── constants.helper.js        # Cache TTLs, base URLs
│       └── fetch.helper.js            # Vortex API fetch wrapper
│
├── docs/                              # API documentation
│   ├── index.md                       # Overview, quick start, features
│   ├── endpoints.md                   # Full API reference (10 endpoints)
│   ├── examples.md                    # cURL, JavaScript, Python
│   └── architecture.md               # This file
│
├── CHANGELOG.md                       # Version history
├── README.md                          # Full API documentation
└── LICENSE                            # MIT License
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Metadata | Vortex Scans API (`api.vortexscans.org/api/query`) |
| Images | Vortex Scans HTML scraping (`vortexscans.org`) |
| Deployment | Vercel (Hobby tier) |
| Caching | In-memory Map with 5-30 min TTL |
| Static Files | Express static middleware |

## Request Flow

```
Client Request
    ↓
Vercel Routes (/api/* → server.js)
    ↓
Express Router (server.js)
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
- **Max Size:** Unbounded
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
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "server.js" },
    { "src": "/(.*)", "dest": "server.js" }
  ]
}
```

- `/api/*` routes to Express for API handling
- `/*` routes to Express for static file serving
- Static files served from `process.cwd()` (Vercel serverless compatible)

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "results": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.21.0 | Web framework |
| cors | ^2.8.5 | CORS headers |

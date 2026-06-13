<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=300&color=gradient&text=𝙑𝙤𝙧𝙩𝙚𝙭𝙎𝙘𝙖𝙣𝙨𝘼𝙋𝙄&fontAlignY=30&fontSize=100&desc=𝖠%20𝖯𝗋𝗈𝖽𝗎𝖼𝗍𝗂𝗈𝗇-𝖱𝖾𝖺𝖽𝗒%20𝖱𝖤𝖲𝖳%20𝖠𝖯%20𝖥𝗈𝗋%20𝖬𝖺𝗇𝗁𝗐𝖺%20𝖶𝖾𝖻𝗌𝗂𝗍𝖾𝗌&descSize=22" />
</div>

<p align="center">
  <a href="https://github.com/Shineii86/VortexScansAPI/stargazers"><img src="https://img.shields.io/github/stars/Shineii86/VortexScansAPI?style=for-the-badge&logo=github&color=f43f8e&logoColor=white" alt="Stars"/></a>
  <a href="https://github.com/Shineii86/VortexScansAPI/network/members"><img src="https://img.shields.io/github/forks/Shineii86/VortexScansAPI?style=for-the-badge&logo=github&color=a855f7&logoColor=white" alt="Forks"/></a>
  <a href="https://github.com/Shineii86/VortexScansAPI/issues"><img src="https://img.shields.io/github/issues/Shineii86/VortexScansAPI?style=for-the-badge&logo=github&color=7c3aed&logoColor=white" alt="Issues"/></a>
  <a href="https://github.com/Shineii86/VortexScansAPI/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Shineii86/VortexScansAPI?style=for-the-badge&logo=mit&color=22c55e&logoColor=white" alt="License"/></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/Version-7.0.0-f43f8e?style=flat-square&logoColor=white" alt="Version"/>
  <img src="https://img.shields.io/badge/Endpoints-14-6366f1?style=flat-square&logoColor=white" alt="Endpoints"/>
  <img src="https://img.shields.io/badge/Manga-355+-a855f7?style=flat-square&logoColor=white" alt="Manga"/>
  <img src="https://img.shields.io/badge/Rate%20Limit-60%2Fmin-ef4444?style=flat-square&logoColor=white" alt="Rate Limit"/>
</p>

<p align="center">
  <b>Production-ready REST API for manga & manhwa websites</b><br/>
  14 endpoints, 355+ manga, chapter images, collections, teams, health check.<br/>
  Consistent envelope, pagination headers, rate limiting, zero auth.
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-api-endpoints">API Docs</a> •
  <a href="#-deployment">Deploy</a> •
  <a href="https://github.com/Shineii86/VortexScansAPI/blob/main/CHANGELOG.md">Changelog</a>
</p>

---

> [!WARNING]
> 1. This API does not store any files — it only links to media hosted on 3rd party services.
> 2. This API is explicitly made for **educational purposes only** and not for commercial usage.
> 3. All manga data, images, and content belong to their respective owners (Vortex Scans). This project is not affiliated with vortexscans.org.

---

## Quick Start

```bash
git clone https://github.com/Shineii86/VortexScansAPI.git
cd VortexScansAPI
npm install
npm start
# → http://localhost:3000
```

**No API key needed.** Just make a request:

```bash
# Home page
curl http://localhost:3000/api/v1/home

# Search
curl "http://localhost:3000/api/v1/search?q=dragon"

# Chapter images
curl http://localhost:3000/api/v1/chapter/27550

# Health check
curl http://localhost:3000/api/v1/health
```

---

## API Endpoints

### Base URL
```
https://vortexscans.vercel.app/api/v1
```

### Response Envelope
Every response follows:
```json
{ "success": true, "data": [...], "pagination": { "total": 355, "perPage": 20, "currentPage": 1, "lastPage": 18, "hasNext": true, "hasPrevious": false } }
```

---

### Home
```
GET /api/v1/home
```
Returns latest, hot, top-rated manga and curated collections.

```json
{
  "success": true,
  "data": {
    "latest": [...],
    "hot": [...],
    "topRated": [...],
    "collections": [...],
    "stats": { "totalManga": 355 }
  }
}
```

---

### Manga List
```
GET /api/v1/manga?page=1&limit=20&type=manhwa&status=ongoing
```

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 48 | Results per page (max 100) |
| `search` | string | — | Search keyword |
| `type` | string | — | manhwa / manga / manhua |
| `status` | string | — | ongoing / hiatus / completed |
| `genre` | string | — | Genre ID |
| `order` | string | — | Sort field |
| `direction` | string | — | asc / desc |
| `hot` | boolean | — | Hot manga filter |

---

### Manga Detail
```
GET /api/v1/manga/:slug
```
Returns full manga info with all chapters.

```json
{
  "success": true,
  "data": {
    "id": 466,
    "slug": "kidnapped-dragons",
    "title": "Kidnapped Dragons",
    "alternativeTitles": "...",
    "type": "manhwa",
    "status": "ongoing",
    "rating": 9.5,
    "totalViews": 1234567,
    "genres": [...],
    "chapters": [...]
  }
}
```

---

### Manga Chapters
```
GET /api/v1/manga/:slug/chapters?page=1&limit=50
```

---

### Chapter Images
```
GET /api/v1/chapter/:chapterId
```

```json
{
  "success": true,
  "data": {
    "id": 27550,
    "slug": "chapter-44",
    "number": 44,
    "title": null,
    "pageCount": 33,
    "images": [
      "https://storage.vortexscans.org/upload/series/.../01.webp",
      "https://storage.vortexscans.org/upload/series/.../02.webp"
    ],
    "series": { "id": 466, "title": "Kidnapped Dragons", "slug": "kidnapped-dragons" },
    "team": null,
    "navigation": {
      "previous": { "slug": "chapter-43", "number": 43 },
      "next": { "slug": "chapter-45", "number": 45 }
    }
  }
}
```

---

### Search
```
GET /api/v1/search?q=solo&page=1&limit=20
```

---

### Filter
```
GET /api/v1/filter?type=manhwa&status=ongoing&genre=1&sort=rating&page=1&limit=48
```

---

### Genres
```
GET /api/v1/genres
```
Returns all 65 genres from upstream API.

---

### Status
```
GET /api/v1/status
```
Returns available statuses, types, and sort options.

---

### Collections
```
GET /api/v1/collections
```
Returns all curated manga collections.

---

### Collection Detail
```
GET /api/v1/collections/:slug
```
Returns collection with works and tags.

---

### Teams
```
GET /api/v1/teams?page=1&perPage=20
```
Returns scanlation teams with stats.

---

### Health Check
```
GET /api/v1/health
```

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "version": "7.0.0",
    "uptime": 86400,
    "upstream": { "status": "ok", "latencyMs": 180, "url": "https://api.vortexscans.org" }
  }
}
```

---

### Stats
```
GET /api/v1/stats
```
Returns API statistics, endpoint listing, and version info.

---

## Pagination Headers

All paginated endpoints include:

| Header | Description |
|--------|-------------|
| `X-Pagination-Total` | Total items |
| `X-Pagination-Per-Page` | Items per page |
| `X-Pagination-Current-Page` | Current page |
| `X-Pagination-Last-Page` | Last page |
| `X-Pagination-Has-Next` | More pages? |
| `X-Pagination-Has-Previous` | Previous pages? |

## Rate Limiting

60 requests per minute per IP.

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Max requests (60) |
| `X-RateLimit-Remaining` | Requests left |
| `X-RateLimit-Reset` | Unix timestamp when window resets |
| `Retry-After` | Seconds to wait (on 429 only) |

---

## Code Examples

### JavaScript
```javascript
const BASE = 'https://vortexscans.vercel.app/api/v1';

// Get manga list
const { data } = await fetch(`${BASE}/manga?limit=5`).then(r => r.json());
data.forEach(m => console.log(`${m.title} — ${m.rating}`));

// Get chapter images
const { data: ch } = await fetch(`${BASE}/chapter/27550`).then(r => r.json());
ch.images.forEach(url => console.log(url));

// Search
const { data: results } = await fetch(`${BASE}/search?q=dragon`).then(r => r.json());
console.log(`Found ${results.length} results`);
```

### Python
```python
import requests

BASE = "https://vortexscans.vercel.app/api/v1"

# Get top-rated manga
r = requests.get(f"{BASE}/manga", params={"sort": "rating", "limit": 5})
for m in r.json()["data"]:
    print(f"⭐ {m['rating']} — {m['title']}")

# Get chapter images
r = requests.get(f"{BASE}/chapter/27550")
print(r.json()["data"]["images"])
```

### cURL
```bash
# Top 5 rated
curl -s "https://vortexscans.vercel.app/api/v1/manga?sort=rating&limit=5" | jq '.data[].title'

# Chapter images count
curl -s "https://vortexscans.vercel.app/api/v1/chapter/27550" | jq '.data.pageCount'

# All ongoing manhwa
curl -s "https://vortexscans.vercel.app/api/v1/manga?status=ongoing&type=manhwa" | jq '.data[].title'
```

---

## Deployment

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shineii86/VortexScansAPI)

### Standalone
```bash
npm install && npm start
# → http://localhost:3000
```

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js 18+ | Runtime |
| Express 4.21 | HTTP server |
| Vortex API | Upstream manga data |
| Vortex CDN | Chapter images |

---

## Project Structure
```
VortexScansAPI/
├── server.js                    # Express entry point
├── package.json
├── src/
│   ├── controllers/
│   │   ├── home.controller.js   # Home page data
│   │   ├── manga.controller.js  # Manga list, detail, chapters
│   │   ├── chapter.controller.js # Chapter images
│   │   ├── search.controller.js # Search
│   │   ├── filter.controller.js # Advanced filter
│   │   ├── genre.controller.js  # Genres & status
│   │   ├── collection.controller.js # Collections
│   │   ├── team.controller.js   # Teams
│   │   └── info.controller.js   # API info
│   ├── helpers/
│   │   ├── cache.helper.js      # In-memory cache
│   │   ├── constants.helper.js  # API URLs, TTL config
│   │   └── fetch.helper.js      # Upstream fetch wrappers
│   └── extractors/
│       └── manga.extractor.js   # Data transformers
├── public/                      # Landing page, docs, 404
├── CHANGELOG.md
└── README.md
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| **7.0.0** | 2026-06-13 | `/api/v1/` routes, consistent envelope, health check, collections, teams, rate limit headers, pagination headers |
| 6.2.0 | 2026-06-13 | Fixed chapter images, input validation |
| 6.1.0 | 2026-06-11 | Fixed chapter navigation, search/genre filtering |
| 6.0.0 | 2026-06-11 | Express server architecture |

> See [CHANGELOG.md](./CHANGELOG.md) for full history.

---

## License

[MIT](./LICENSE) — Free to use, modify, and distribute.

---

## Author

**Shinei Nouzen** — [GitHub](https://github.com/Shineii86) • [Telegram](https://telegram.me/Shineii86) • [Instagram](https://instagram.com/ikx7.a)

---

<p align="center">
  <b>Made with ❤️ for the manga community</b>
</p>

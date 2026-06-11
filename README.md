# VortexScans API

Unofficial REST API for [Vortex Scans](https://vortexscans.org).

## Base URL

```
https://vortex-scans-api.vercel.app/api
```

## Architecture

```
api/                    # Vercel Serverless Functions
├── manga.js            # Manga list & detail routes
├── genres.js           # Genres route
├── status.js           # Status route
└── index.js            # API info route

src/
├── controllers/        # Route handlers
│   ├── manga.controller.js
│   ├── genres.controller.js
│   ├── status.controller.js
│   └── index.controller.js
├── extractors/         # Data transformation
│   └── manga.extractor.js
└── helpers/            # Utilities
    ├── cache.helper.js
    └── constants.helper.js
```

## Caching

| Endpoint | TTL |
|----------|-----|
| `/api/manga` | 5 minutes |
| `/api/manga/{slug}` | 5 minutes |
| `/api/genres` | 1 hour |
| `/api/status` | 24 hours |

## Endpoints

### List Manga

```
GET /api/manga
```

| Param     | Type    | Default | Description                    |
|-----------|---------|---------|--------------------------------|
| page      | number  | 1       | Page number                    |
| limit     | number  | 48      | Items per page                 |
| search    | string  | -       | Search by title                |
| type      | string  | -       | manhwa / manga / manhua        |
| status    | string  | -       | ongoing / hiatus / completed   |
| genre     | string  | -       | Genre name                     |
| order     | string  | -       | Sort field                     |
| direction | string  | -       | asc / desc                     |
| hot       | boolean | -       | Hot series only                |

```bash
curl "https://vortex-scans-api.vercel.app/api/manga?search=reality&type=manhwa"
```

### Manga Detail

```
GET /api/manga/{slug}
```

| Param | Type   | Default | Description       |
|-------|--------|---------|-------------------|
| page  | number | 1       | Chapters page     |
| limit | number | 50      | Chapters per page |

```bash
curl "https://vortex-scans-api.vercel.app/api/manga/reality-quest-2"
```

### Genres

```
GET /api/genres
```

### Status & Types

```
GET /api/status
```

## Response

```json
{
  "success": true,
  "data": [...],
  "pagination": { "page": 1, "limit": 48, "total": 355, "totalPages": 8 }
}
```

## License

MIT

Made by **Shineii86**

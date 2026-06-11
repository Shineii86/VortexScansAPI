# API Endpoints Reference

Complete documentation for all 10 VortexScans API endpoints.

---

## Table of Contents

- [API Info](#api-info)
- [Home](#home)
- [Manga List](#manga-list)
- [Manga Detail](#manga-detail)
- [Manga Chapters](#manga-chapters)
- [Chapter Images](#chapter-images)
- [Search](#search)
- [Filter](#filter)
- [Genres](#genres)
- [Status](#status)

---

## API Info

```
GET /api
```

Returns API documentation including all available endpoints, parameters, and cache settings.

**Response:**

```json
{
  "success": true,
  "name": "VortexScans API",
  "version": "3.0.0",
  "description": "Unofficial REST API for Vortex Scans (vortexscans.org)",
  "endpoints": {
    "home": { "url": "/api/home", "method": "GET" },
    "manga": { "list": { "url": "/api/manga" }, "detail": { "url": "/api/manga/{slug}" } },
    "chapter": { "images": { "url": "/api/chapter?slug=&chapter=" } },
    "search": { "url": "/api/search?q=keyword" },
    "filter": { "url": "/api/filter?type=manhwa&status=ongoing" },
    "genres": { "url": "/api/genres" },
    "status": { "url": "/api/status" }
  }
}
```

---

## Home

```
GET /api/home
```

Returns aggregated home page data: latest, hot, and top rated manga collections plus genre metadata.

**Response:**

```json
{
  "success": true,
  "data": {
    "latest": [ { "id": 1, "slug": "solo-leveling", "title": "Solo Leveling", ... } ],
    "hot": [ ... ],
    "topRated": [ ... ],
    "genres": [ { "id": 1, "name": "Action" }, { "id": 2, "name": "Adventure" } ],
    "stats": { "totalManga": 355 }
  }
}
```

---

## Manga List

```
GET /api/manga
```

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 48 | Results per page (max 100) |
| `search` | string | No | — | Search keyword |
| `type` | string | No | — | manhwa, manga, manhua |
| `status` | string | No | — | ongoing, hiatus, completed |
| `genre` | string | No | — | Genre ID |
| `order` | string | No | — | Sort field |
| `direction` | string | No | — | asc, desc |
| `hot` | string | No | — | "true" for hot manga |

**Example:** `GET /api/manga?page=1&limit=5&type=manhwa&status=ongoing`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "slug": "solo-leveling",
      "title": "Solo Leveling",
      "image": "https://storage.vortexscans.org/...",
      "type": "manhwa",
      "status": "completed",
      "rating": 9.2,
      "hot": true,
      "genres": [ { "id": 1, "name": "Action" } ],
      "chapters": [ ... ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 355,
    "totalPages": 71
  }
}
```

---

## Manga Detail

```
GET /api/manga?slug={slug}
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | Yes | Manga URL slug |
| `page` | number | No | Chapter page (default 1) |
| `limit` | number | No | Chapters per page (default 50) |

**Example:** `GET /api/manga?slug=solo-leveling`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "slug": "solo-leveling",
    "title": "Solo Leveling",
    "image": "https://storage.vortexscans.org/...",
    "type": "manhwa",
    "status": "completed",
    "chapters": [ ... ],
    "pagination": { "page": 1, "limit": 50, "total": 200, "totalPages": 4 }
  }
}
```

---

## Manga Chapters

```
GET /api/manga?slug={slug}&action=chapters
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | Yes | Manga URL slug |
| `page` | number | No | Chapter page (default 1) |
| `limit` | number | No | Chapters per page (default 50) |

**Example:** `GET /api/manga?slug=solo-leveling&action=chapters`

**Response:**

```json
{
  "success": true,
  "manga": {
    "slug": "solo-leveling",
    "title": "Solo Leveling",
    "image": "https://storage.vortexscans.org/..."
  },
  "data": [
    {
      "id": 456,
      "number": 1,
      "title": "Chapter 1",
      "slug": "chapter-1",
      "createdAt": "2024-01-15T00:00:00Z",
      "locked": false,
      "accessible": true,
      "url": "https://vortexscans.org/series/solo-leveling/chapter-1"
    }
  ],
  "pagination": { "page": 1, "limit": 50, "total": 200, "totalPages": 4 }
}
```

---

## Chapter Images

```
GET /api/chapter?slug={manga-slug}&chapter={chapter-slug}
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | Yes | Manga slug |
| `chapter` | string | Yes | Chapter slug (e.g. chapter-1) |

**Example:** `GET /api/chapter?slug=solo-leveling&chapter=chapter-1`

**Response:**

```json
{
  "success": true,
  "manga": { "slug": "solo-leveling" },
  "chapter": {
    "slug": "chapter-1",
    "title": "Chapter 1",
    "images": [
      { "page": 1, "url": "https://storage.vortexscans.org/upload/series/solo-leveling/chapter-1/page-1_..." },
      { "page": 2, "url": "https://storage.vortexscans.org/upload/series/solo-leveling/chapter-1/page-2_..." }
    ],
    "totalPages": 20,
    "navigation": {
      "prev": null,
      "next": { "slug": "chapter-2", "url": "https://vortexscans.org/series/solo-leveling/chapter-2" }
    }
  }
}
```

---

## Search

```
GET /api/search
```

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `q` | string | Yes | — | Search query |
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 20 | Results per page (max 100) |

**Example:** `GET /api/search?q=naruto&limit=5`

**Response:**

```json
{
  "success": true,
  "query": "naruto",
  "data": [ ... ],
  "pagination": { "page": 1, "limit": 5, "total": 12, "totalPages": 3 }
}
```

---

## Filter

```
GET /api/filter
```

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `type` | string | No | — | manhwa, manga, manhua |
| `status` | string | No | — | ongoing, hiatus, completed |
| `genre` | string | No | — | Genre ID |
| `sort` | string | No | lastChapterAddedAt | Sort field |
| `direction` | string | No | desc | Sort direction |
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 48 | Results per page (max 100) |

**Example:** `GET /api/filter?type=manhwa&status=ongoing&limit=5`

**Response:**

```json
{
  "success": true,
  "filters": {
    "type": "manhwa",
    "status": "ongoing",
    "genre": null,
    "sort": "lastChapterAddedAt",
    "direction": "desc"
  },
  "data": [ ... ],
  "pagination": { "page": 1, "limit": 5, "total": 150, "totalPages": 30 }
}
```

---

## Genres

```
GET /api/genres
```

Returns all unique genres aggregated from manga data.

**Response:**

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Action" },
    { "id": 2, "name": "Adventure" },
    { "id": 3, "name": "Comedy" }
  ],
  "total": 54
}
```

---

## Status

```
GET /api/status
```

Returns available statuses, types, and sort options for filtering.

**Response:**

```json
{
  "success": true,
  "data": {
    "statuses": [
      { "id": "ongoing", "name": "Ongoing" },
      { "id": "hiatus", "name": "Hiatus" },
      { "id": "completed", "name": "Completed" }
    ],
    "types": [
      { "id": "manhwa", "name": "Manhwa" },
      { "id": "manhua", "name": "Manhua" },
      { "id": "manga", "name": "Manga" }
    ],
    "sortOptions": [
      { "id": "lastChapterAddedAt", "name": "Latest Update" },
      { "id": "averageRating", "name": "Top Rated" },
      { "id": "createdAt", "name": "Newest" }
    ]
  }
}
```

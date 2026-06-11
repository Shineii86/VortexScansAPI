# VortexScans API

Unofficial REST API for [Vortex Scans](https://vortexscans.org).

## API Base URL

```
https://vortex-scans-api.vercel.app/api
```

## Endpoints

### List Manga

```
GET /api/manga
```

**Parameters:**

| Parameter  | Type    | Default | Description                      |
|------------|---------|---------|----------------------------------|
| page       | number  | 1       | Page number                      |
| limit      | number  | 48      | Items per page                   |
| search     | string  | -       | Search by title                  |
| type       | string  | -       | Filter: manhwa, manga, manhua    |
| status     | string  | -       | Filter: ongoing, hiatus, completed |
| genre      | string  | -       | Filter by genre name             |
| order      | string  | -       | Sort field                       |
| direction  | string  | -       | asc or desc                      |
| hot        | boolean | -       | Filter hot series only           |

**Example:**

```bash
curl https://vortex-scans-api.vercel.app/api/manga?page=1&limit=10&type=manhwa
```

### Manga Detail

```
GET /api/manga/{slug}
```

**Parameters:**

| Parameter | Type   | Default | Description         |
|-----------|--------|---------|---------------------|
| page      | number | 1       | Chapters page       |
| limit     | number | 50      | Chapters per page   |

**Example:**

```bash
curl https://vortex-scans-api.vercel.app/api/manga/reality-quest-2
```

### Search Manga

```
GET /api/manga?search={query}
```

**Example:**

```bash
curl "https://vortex-scans-api.vercel.app/api/manga?search=reality+quest"
```

### Get Genres

```
GET /api/genres
```

### Get Status & Types

```
GET /api/status
```

## Response Format

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 48,
    "total": 355,
    "totalPages": 8
  }
}
```

## Data Structure

### Manga Object

```json
{
  "id": 94,
  "slug": "reality-quest-2",
  "title": "Reality Quest",
  "image": "https://storage.vortexscans.org/...",
  "type": "manhwa",
  "status": "ongoing",
  "hot": true,
  "pinned": false,
  "rating": 9.04,
  "genres": [
    { "id": 3, "name": "Shounen" }
  ],
  "chapters": [
    {
      "id": 27917,
      "number": 209,
      "title": null,
      "slug": "chapter-209",
      "createdAt": "2026-06-11T00:09:50.091Z",
      "locked": false
    }
  ]
}
```

## Rate Limiting

Please be respectful and cache responses. The API caches responses for 5 minutes.

## License

MIT

## Author

**Shineii86** - [GitHub](https://github.com/Shineii86)

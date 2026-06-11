# VortexScans API Documentation

> Free REST API for manga, manhwa, and manhua data. 10 endpoints, 355+ titles, 54 genres. No API key required.

## Overview

VortexScans API is a free, open-source REST API that provides manga and manhwa data by aggregating from Vortex Scans. It's built with Node.js and deployed on Vercel.

**Base URL:** `https://vortexscans.vercel.app/api`

## Quick Start

```bash
# Search for manga
curl "https://vortexscans.vercel.app/api/search?q=naruto"

# Get manga list
curl "https://vortexscans.vercel.app/api/manga?limit=5"

# Get chapter images
curl "https://vortexscans.vercel.app/api/chapter?slug=solo-leveling&chapter=chapter-1"
```

**Live Response — Search:**

```json
{
  "success": true,
  "query": "naruto",
  "data": [
    {
      "id": 123,
      "slug": "naruto",
      "title": "Naruto",
      "image": "https://storage.vortexscans.org/...",
      "type": "manga",
      "status": "completed",
      "rating": 8.5,
      "genres": [{ "id": 1, "name": "Action" }]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

## Features

- **10 Endpoints** — Home, manga list, detail, chapters, chapter images, search, filter, genres, status, API info
- **No API Key** — Just make requests, no registration needed
- **In-Memory Cache** — 5-minute TTL for fast responses
- **CORS Enabled** — Access from any domain
- **JSON Responses** — Standardized `{success, data}` format

## Documentation

- [API Endpoints Reference](endpoints.md) — Complete endpoint documentation with parameters
- [Code Examples](examples.md) — cURL, JavaScript, Python (all tested and working)
- [Architecture](architecture.md) — Project structure and design decisions

## Response Format

All endpoints return JSON in this format:

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

## Rate Limiting

The API uses a 5-minute in-memory cache. Repeated requests for the same data will be served from cache automatically.

## Disclaimer

This API is for **educational purposes only**. It fetches data from Vortex Scans. We are not affiliated with or endorsed by Vortex Scans. All content belongs to its respective owners.

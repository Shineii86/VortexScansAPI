# Code Examples

All examples are tested and working with the live API.

---

## cURL

### Search

```bash
curl "https://vortexscans.vercel.app/api/search?q=naruto"
```

### Manga List

```bash
curl "https://vortexscans.vercel.app/api/manga?limit=5"
```

### Manga Detail

```bash
curl "https://vortexscans.vercel.app/api/manga?slug=solo-leveling"
```

### Chapter Images

```bash
curl "https://vortexscans.vercel.app/api/chapter?slug=solo-leveling&chapter=chapter-1"
```

### Filter

```bash
curl "https://vortexscans.vercel.app/api/filter?type=manhwa&status=ongoing"
```

### Genres

```bash
curl "https://vortexscans.vercel.app/api/genres"
```

### Status

```bash
curl "https://vortexscans.vercel.app/api/status"
```

### Home

```bash
curl "https://vortexscans.vercel.app/api/home"
```

### API Info

```bash
curl "https://vortexscans.vercel.app/api"
```

---

## JavaScript (Browser)

### Search Manga

```javascript
async function searchManga(query) {
  const res = await fetch(`https://vortexscans.vercel.app/api/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  
  return data.data.map(manga => ({
    id: manga.id,
    slug: manga.slug,
    title: manga.title,
    type: manga.type,
    status: manga.status,
    rating: manga.rating
  }));
}

searchManga('naruto').then(results => {
  results.forEach(m => console.log(`${m.title} (${m.type}) — Rating: ${m.rating}`));
});
```

### Manga Detail

```javascript
async function getMangaDetail(slug) {
  const res = await fetch(`https://vortexscans.vercel.app/api/manga?slug=${slug}`);
  const data = await res.json();
  
  const info = data.data;
  console.log(`Title: ${info.title}`);
  console.log(`Type: ${info.type}`);
  console.log(`Status: ${info.status}`);
  console.log(`Rating: ${info.rating}`);
  
  return info;
}

getMangaDetail('solo-leveling');
```

### Get Chapter Images

```javascript
async function getChapterImages(slug, chapter) {
  const res = await fetch(`https://vortexscans.vercel.app/api/chapter?slug=${slug}&chapter=${chapter}`);
  const data = await res.json();
  
  return data.chapter.images;
}

// Usage
getChapterImages('solo-leveling', 'chapter-1')
  .then(images => {
    images.forEach(img => console.log(`Page ${img.page}: ${img.url}`));
  })
  .catch(err => console.error('Error:', err.message));
```

### Filter by Type

```javascript
async function filterManga(type, limit = 5) {
  const res = await fetch(`https://vortexscans.vercel.app/api/filter?type=${type}&limit=${limit}`);
  const data = await res.json();
  
  return data.data;
}

filterManga('manhwa', 3).then(manga => {
  manga.forEach(m => console.log(`${m.title} — Rating: ${m.rating}`));
});
```

### Get All Genres

```javascript
async function getGenres() {
  const res = await fetch('https://vortexscans.vercel.app/api/genres');
  const data = await res.json();
  
  return data.data;
}

getGenres().then(genres => {
  genres.forEach(g => console.log(`${g.id}: ${g.name}`));
});
```

---

## Node.js (with axios)

### Search

```javascript
const axios = require('axios');

async function searchManga(query) {
  const { data } = await axios.get('https://vortexscans.vercel.app/api/search', {
    params: { q: query }
  });
  
  return data.data;
}

searchManga('naruto').then(results => {
  results.forEach(m => console.log(`${m.title}`));
});
```

### Full Manga Reading Flow

```javascript
const axios = require('axios');

async function readManga(slug) {
  const BASE = 'https://vortexscans.vercel.app/api';
  
  // Step 1: Get manga detail
  const { data: mangaData } = await axios.get(`${BASE}/manga`, {
    params: { slug }
  });
  
  const manga = mangaData.data;
  console.log(`Reading: ${manga.title}`);
  
  // Step 2: Get chapters
  const { data: chaptersData } = await axios.get(`${BASE}/manga`, {
    params: { slug, action: 'chapters' }
  });
  
  const chapters = chaptersData.data;
  console.log(`Total chapters: ${chapters.length}`);
  
  // Step 3: Get chapter images
  if (chapters.length > 0) {
    const firstChapter = chapters[0];
    const { data: chapterData } = await axios.get(`${BASE}/chapter`, {
      params: { slug, chapter: firstChapter.slug }
    });
    
    const images = chapterData.chapter.images;
    console.log(`Pages in Chapter ${firstChapter.number}: ${images.length}`);
    
    return { manga, chapters, images };
  }
}

readManga('solo-leveling');
```

### Filter by Status

```javascript
const axios = require('axios');

async function getOngoingManhwa(limit = 5) {
  const { data } = await axios.get('https://vortexscans.vercel.app/api/filter', {
    params: { type: 'manhwa', status: 'ongoing', limit }
  });
  
  return data.data;
}

getOngoingManhwa(3).then(manga => {
  manga.forEach(m => console.log(`${m.title} — ${m.status}`));
});
```

---

## Python

### Search

```python
import requests

def search_manga(query):
    base = "https://vortexscans.vercel.app/api"
    res = requests.get(f"{base}/search", params={"q": query})
    data = res.json()
    return data['data']

results = search_manga('naruto')
for manga in results:
    print(f"{manga['title']} ({manga['type']}) — Rating: {manga['rating']}")
```

### Full Reading Flow

```python
import requests

def read_manga(slug):
    base = "https://vortexscans.vercel.app/api"
    
    # Step 1: Get manga detail
    manga_res = requests.get(f"{base}/manga", params={"slug": slug})
    manga = manga_res.json()['data']
    print(f"Reading: {manga['title']}")
    
    # Step 2: Get chapters
    chapters_res = requests.get(f"{base}/manga", params={"slug": slug, "action": "chapters"})
    chapters = chapters_res.json()['data']
    print(f"Total chapters: {len(chapters)}")
    
    # Step 3: Get chapter images
    if chapters:
        first_chapter = chapters[0]
        chapter_res = requests.get(f"{base}/chapter", params={"slug": slug, "chapter": first_chapter['slug']})
        images = chapter_res.json()['chapter']['images']
        print(f"Pages in Chapter {first_chapter['number']}: {len(images)}")
        
        return {"manga": manga, "chapters": chapters, "images": images}

read_manga('solo-leveling')
```

### Filter

```python
import requests

def filter_manga(manga_type=None, status=None, limit=5):
    base = "https://vortexscans.vercel.app/api"
    params = {"limit": limit}
    if manga_type:
        params["type"] = manga_type
    if status:
        params["status"] = status
    
    res = requests.get(f"{base}/filter", params=params)
    return res.json()['data']

results = filter_manga(manga_type="manhwa", status="ongoing", limit=3)
for manga in results:
    print(f"{manga['title']} — {manga['status']}")
```

---

## cURL (Advanced)

### Filter by Genre

```bash
# Get all genres first
curl "https://vortexscans.vercel.app/api/genres"

# Then filter by genre ID
curl "https://vortexscans.vercel.app/api/filter?genre=1&limit=5"
```

### Pagination

```bash
# Get page 2 with 10 results
curl "https://vortexscans.vercel.app/api/manga?page=2&limit=10"

# Get chapter page 2
curl "https://vortexscans.vercel.app/api/manga?slug=solo-leveling&action=chapters&page=2"
```

### Hot Manga

```bash
curl "https://vortexscans.vercel.app/api/manga?hot=true&limit=10"
```

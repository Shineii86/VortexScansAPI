const { getMangaList, getMangaBySlug, getMangaChapters } = require('./src/controllers/manga.controller');
const { getChapterImages } = require('./src/controllers/chapter.controller');
const { getHome } = require('./src/controllers/home.controller');
const { searchManga } = require('./src/controllers/search.controller');
const { filterManga } = require('./src/controllers/filter.controller');
const { getGenres, getStatus } = require('./src/controllers/genre.controller');
const { getApiInfo } = require('./src/controllers/info.controller');

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    const result = await fn();
    if (result.success !== false) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}: ${result.error}`);
      failed++;
    }
    return result;
  } catch (err) {
    console.log(`❌ ${name}: ${err.message}`);
    failed++;
    return null;
  }
}

async function run() {
  console.log('🧪 VortexScans API v3.0 - Test Suite\n');

  await test('GET /api (info)', async () => {
    const r = await getApiInfo();
    console.log(`   Version: ${r.version}`);
    return r;
  });

  await test('GET /api/home', async () => {
    const r = await getHome();
    console.log(`   Latest: ${r.data.latest.length}, Hot: ${r.data.hot.length}, Top: ${r.data.topRated.length}`);
    return r;
  });

  await test('GET /api/manga (list)', async () => {
    const r = await getMangaList({ page: 1, limit: 5 });
    console.log(`   Total: ${r.pagination.total}, First: ${r.data[0]?.title}`);
    return r;
  });

  await test('GET /api/search?q=reality', async () => {
    const r = await searchManga({ q: 'reality' });
    console.log(`   Found: ${r.data.length} results`);
    return r;
  });

  await test('GET /api/manga/reality-quest-2', async () => {
    const r = await getMangaBySlug('reality-quest-2', {});
    console.log(`   Title: ${r.data?.title}, Chapters: ${r.data?.pagination?.total}`);
    return r;
  });

  await test('GET /api/manga/reality-quest-2/chapters', async () => {
    const r = await getMangaChapters('reality-quest-2', {});
    console.log(`   Total chapters: ${r.pagination?.total}`);
    return r;
  });

  await test('GET /api/chapter?slug=reality-quest-2&chapter=chapter-209', async () => {
    const r = await getChapterImages('reality-quest-2', 'chapter-209');
    console.log(`   Images: ${r.chapter?.totalPages}, Prev: ${r.chapter?.navigation?.prev?.slug || 'none'}`);
    return r;
  });

  await test('GET /api/filter?type=manhwa', async () => {
    const r = await filterManga({ type: 'manhwa', limit: 5 });
    console.log(`   Filtered: ${r.data.length} manhwa`);
    return r;
  });

  await test('GET /api/genres', async () => {
    const r = await getGenres();
    console.log(`   Total: ${r.total} genres`);
    return r;
  });

  await test('GET /api/status', async () => {
    const r = await getStatus();
    console.log(`   Statuses: ${r.data.statuses.length}, Types: ${r.data.types.length}`);
    return r;
  });

  await test('Cache test (second call)', async () => {
    const start = Date.now();
    await getMangaList({ page: 1, limit: 5 });
    const ms = Date.now() - start;
    console.log(`   Response: ${ms}ms`);
    return { success: ms < 100 };
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
}

run();

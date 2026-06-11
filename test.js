const { getMangaList, getMangaBySlug } = require('./src/controllers/manga.controller');
const { getGenres } = require('./src/controllers/genres.controller');
const { getStatus } = require('./src/controllers/status.controller');
const { getApiInfo } = require('./src/controllers/index.controller');

async function test(name, fn) {
  try {
    const result = await fn();
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${name}`);
    if (!result.success) console.log(`   Error: ${result.error}`);
    return result;
  } catch (err) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${err.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Testing VortexScans API\n');

  await test('GET /api (info)', async () => {
    const r = await getApiInfo();
    console.log(`   Version: ${r.version}`);
    return r;
  });

  await test('GET /api/manga (list)', async () => {
    const r = await getMangaList({ page: 1, limit: 5 });
    console.log(`   Found: ${r.pagination.total} manga`);
    console.log(`   First: ${r.data[0]?.title}`);
    return r;
  });

  await test('GET /api/manga?search=reality', async () => {
    const r = await getMangaList({ search: 'reality', limit: 5 });
    console.log(`   Found: ${r.data.length} results`);
    return r;
  });

  await test('GET /api/manga?type=manhwa', async () => {
    const r = await getMangaList({ type: 'manhwa', limit: 5 });
    console.log(`   Found: ${r.data.length} manhwa`);
    return r;
  });

  await test('GET /api/manga/reality-quest-2 (detail)', async () => {
    const r = await getMangaBySlug('reality-quest-2', {});
    console.log(`   Title: ${r.data?.title}`);
    console.log(`   Chapters: ${r.data?.pagination?.total}`);
    return r;
  });

  await test('GET /api/genres', async () => {
    const r = await getGenres();
    console.log(`   Found: ${r.total} genres`);
    return r;
  });

  await test('GET /api/status', async () => {
    const r = await getStatus();
    console.log(`   Statuses: ${r.data.statuses.length}`);
    console.log(`   Types: ${r.data.types.length}`);
    return r;
  });

  await test('Cache test (second call should be cached)', async () => {
    const start = Date.now();
    await getMangaList({ page: 1, limit: 5 });
    const ms = Date.now() - start;
    console.log(`   Response time: ${ms}ms (should be <10ms if cached)`);
    return { success: ms < 50 };
  });

  console.log('\n✅ All tests complete');
}

runTests();

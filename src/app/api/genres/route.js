const VORTEX_API = 'https://api.vortexscans.org/api/query';

async function fetchAllGenres() {
  const response = await fetch(
    `${VORTEX_API}?page=1&perPage=1&view=archive&orderBy=lastChapterAddedAt&orderDirection=desc`,
    {
      headers: {
        'User-Agent': 'VortexScansAPI/1.0',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Vortex API error: ${response.status}`);
  }

  const genreMap = new Map();
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 10) {
    const data = await fetch(
      `${VORTEX_API}?page=${page}&perPage=100&view=archive&orderBy=lastChapterAddedAt&orderDirection=desc`,
      {
        headers: {
          'User-Agent': 'VortexScansAPI/1.0',
        },
      }
    );

    const result = await data.json();

    for (const post of result.posts || []) {
      for (const genre of post.genres || []) {
        if (!genreMap.has(genre.id)) {
          genreMap.set(genre.id, {
            id: genre.id,
            name: genre.name,
          });
        }
      }
    }

    hasMore = (result.posts || []).length === 100;
    page++;
  }

  return Array.from(genreMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export async function GET() {
  try {
    const genres = await fetchAllGenres();

    return Response.json(
      {
        success: true,
        data: genres,
        total: genres.length,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

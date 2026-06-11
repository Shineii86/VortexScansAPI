const VORTEX_API = 'https://api.vortexscans.org/api/query';

async function fetchVortex(params = {}) {
  const defaultParams = {
    page: 1,
    perPage: 48,
    view: 'archive',
    orderBy: 'lastChapterAddedAt',
    orderDirection: 'desc',
  };

  const searchParams = new URLSearchParams({ ...defaultParams, ...params });
  const response = await fetch(`${VORTEX_API}?${searchParams.toString()}`, {
    headers: {
      'User-Agent': 'VortexScansAPI/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Vortex API error: ${response.status}`);
  }

  return response.json();
}

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);

    const queryParams = {
      search: slug,
      perPage: 100,
    };

    const data = await fetchVortex(queryParams);

    const post = (data.posts || []).find((p) => p.slug === slug);

    if (!post) {
      return Response.json(
        {
          success: false,
          error: 'Manga not found',
        },
        { status: 404 }
      );
    }

    const pageParam = parseInt(searchParams.get('page')) || 1;
    const limitParam = parseInt(searchParams.get('limit')) || 50;

    const allChapters = (post.chapters || []).map((ch) => ({
      id: ch.id,
      number: ch.number,
      title: ch.title || null,
      slug: ch.slug,
      createdAt: ch.createdAt,
      locked: ch.isLocked,
    }));

    const totalChapters = allChapters.length;
    const startIndex = (pageParam - 1) * limitParam;
    const paginatedChapters = allChapters.slice(
      startIndex,
      startIndex + limitParam
    );

    const transformed = {
      id: post.id,
      slug: post.slug,
      title: post.postTitle,
      image: post.featuredImage,
      type: post.seriesType?.toLowerCase(),
      status: post.seriesStatus?.toLowerCase(),
      hot: post.hot,
      pinned: post.isPinned,
      rating: post.averageRating,
      genres: (post.genres || []).map((g) => ({
        id: g.id,
        name: g.name,
      })),
      chapters: paginatedChapters,
      pagination: {
        page: pageParam,
        limit: limitParam,
        total: totalChapters,
        totalPages: Math.ceil(totalChapters / limitParam),
      },
    };

    return Response.json(
      {
        success: true,
        data: transformed,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
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

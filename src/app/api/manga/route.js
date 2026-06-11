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

function transformPost(post) {
  return {
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
    chapters: (post.chapters || []).map((ch) => ({
      id: ch.id,
      number: ch.number,
      title: ch.title || null,
      slug: ch.slug,
      createdAt: ch.createdAt,
      locked: ch.isLocked,
    })),
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {};

    if (searchParams.has('page')) {
      params.page = parseInt(searchParams.get('page')) || 1;
    }

    if (searchParams.has('limit') || searchParams.has('perPage')) {
      params.perPage = parseInt(
        searchParams.get('limit') || searchParams.get('perPage')
      ) || 48;
    }

    if (searchParams.has('search')) {
      params.search = searchParams.get('search');
    }

    if (searchParams.has('type')) {
      params.seriesType = searchParams.get('type').toUpperCase();
    }

    if (searchParams.has('status')) {
      params.seriesStatus = searchParams.get('status').toUpperCase();
    }

    if (searchParams.has('genre')) {
      params.genre = searchParams.get('genre');
    }

    if (searchParams.has('order') || searchParams.has('orderBy')) {
      params.orderBy = searchParams.get('order') || searchParams.get('orderBy');
    }

    if (searchParams.has('direction') || searchParams.has('orderDirection')) {
      params.orderDirection =
        searchParams.get('direction') || searchParams.get('orderDirection');
    }

    if (searchParams.has('hot')) {
      params.hot = searchParams.get('hot') === 'true';
    }

    const data = await fetchVortex(params);

    const transformed = {
      success: true,
      data: (data.posts || []).map(transformPost),
      pagination: {
        page: params.page || 1,
        perPage: params.perPage || 48,
        total: data.totalCount || 0,
        totalPages: Math.ceil((data.totalCount || 0) / (params.perPage || 48)),
      },
    };

    return Response.json(transformed, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
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

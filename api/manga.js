const VORTEX_API = 'https://api.vortexscans.org/api/query';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { slug } = req.query;

    if (slug) {
      const data = await fetchVortex({ search: slug, perPage: 100 });
      const post = (data.posts || []).find((p) => p.slug === slug);

      if (!post) {
        return res.status(404).json({ success: false, error: 'Manga not found' });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const allChapters = (post.chapters || []).map(transformChapter);
      const total = allChapters.length;
      const start = (page - 1) * limit;

      return res.json({
        success: true,
        data: {
          ...transformPost(post),
          chapters: allChapters.slice(start, start + limit),
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        },
      });
    }

    const params = {
      page: parseInt(req.query.page) || 1,
      perPage: parseInt(req.query.limit) || 48,
    };

    if (req.query.search) params.search = req.query.search;
    if (req.query.type) params.seriesType = req.query.type.toUpperCase();
    if (req.query.status) params.seriesStatus = req.query.status.toUpperCase();
    if (req.query.genre) params.genre = req.query.genre;
    if (req.query.order) params.orderBy = req.query.order;
    if (req.query.direction) params.orderDirection = req.query.direction;
    if (req.query.hot === 'true') params.hot = true;

    const data = await fetchVortex(params);

    return res.json({
      success: true,
      data: (data.posts || []).map(transformPost),
      pagination: {
        page: params.page,
        limit: params.perPage,
        total: data.totalCount || 0,
        totalPages: Math.ceil((data.totalCount || 0) / params.perPage),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function fetchVortex(params = {}) {
  const defaults = { page: 1, perPage: 48, view: 'archive', orderBy: 'lastChapterAddedAt', orderDirection: 'desc' };
  const searchParams = new URLSearchParams({ ...defaults, ...params });
  const response = await fetch(`${VORTEX_API}?${searchParams}`);
  if (!response.ok) throw new Error(`Vortex API error: ${response.status}`);
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
    genres: (post.genres || []).map((g) => ({ id: g.id, name: g.name })),
    chapters: (post.chapters || []).map(transformChapter),
  };
}

function transformChapter(ch) {
  return {
    id: ch.id,
    number: ch.number,
    title: ch.title || null,
    slug: ch.slug,
    createdAt: ch.createdAt,
    locked: ch.isLocked,
  };
}

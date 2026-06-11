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
    genres: (post.genres || []).map(transformGenre),
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

function transformGenre(g) {
  return { id: g.id, name: g.name };
}

function transformMangaList(data, params) {
  return {
    success: true,
    data: (data.posts || []).map(transformPost),
    pagination: {
      page: params.page || 1,
      limit: params.perPage || 48,
      total: data.totalCount || 0,
      totalPages: Math.ceil((data.totalCount || 0) / (params.perPage || 48)),
    },
  };
}

function transformMangaDetail(post, page, limit) {
  const allChapters = (post.chapters || []).map(transformChapter);
  const total = allChapters.length;
  const start = (page - 1) * limit;

  return {
    success: true,
    data: {
      ...transformPost(post),
      chapters: allChapters.slice(start, start + limit),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  };
}

module.exports = {
  transformPost,
  transformChapter,
  transformGenre,
  transformMangaList,
  transformMangaDetail,
};

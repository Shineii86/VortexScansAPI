/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — team.controller.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Business logic for teams endpoint. Fetches scanlation teams
 *   from the upstream Vortex Scans API with pagination.
 *
 * @exports
 *   getTeams
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const cache = require('../helpers/cache.helper');
const { CACHE_TTL } = require('../helpers/constants.helper');
const { fetchTeams } = require('../helpers/fetch.helper');

const getTeams = async (query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const perPage = Math.min(Math.max(parseInt(query.perPage) || 20, 1), 100);

  const cacheKey = `teams:${page}:${perPage}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data = await fetchTeams({ page, perPage });
  const teams = (data.teams || []).map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    type: t.type,
    avatarUrl: t.avatarUrl,
    description: t.description,
    bio: t.bio,
    isVerified: t.isVerified,
    socialLinks: t.socialLinks || [],
    stats: {
      members: t._count?.members || 0,
      chapters: t.totalChaptersCount || 0,
      posts: t.totalPostsCount || 0,
      likes: t.totalLikes || 0,
    },
  }));

  const total = data.totalCount || 0;
  const result = {
    data: teams,
    pagination: {
      total,
      perPage,
      currentPage: page,
      lastPage: Math.ceil(total / perPage),
      hasNext: page < Math.ceil(total / perPage),
      hasPrevious: page > 1,
    },
  };

  cache.set(cacheKey, result, CACHE_TTL.TEAMS);
  return result;
};

module.exports = { getTeams };

// ══════════════════════════════════════════════════════════════ END: team.controller.js

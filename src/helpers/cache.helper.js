/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — cache.helper.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   In-memory caching utility for storing and retrieving API responses.
 *   Implements TTL-based cache invalidation to prevent stale data
 *   while reducing unnecessary requests to Vortex Scans backends.
 *
 * @exports
 *   get, set, has, size, getCacheKey
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ══════════════════════════════════════════════════════════════
// CACHE STORAGE & CONFIGURATION
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: In-memory Map-based cache storage ----
/**
 * Internal cache storage using JavaScript Map object.
 * Stores data with expiry timestamps for TTL-based expiration.
 *
 * @type {Map<string, {data: any, expiresAt: number}>}
 */
const cache = new Map();

// ---- FEATURE: Cache time-to-live configuration (5 minutes) ----
/**
 * Default cache TTL (Time-To-Live) in milliseconds.
 * Default: 5 minutes (300,000 ms).
 * After this duration, cached items are considered stale
 * and will be removed on next access.
 *
 * @type {number}
 * @default 300000
 */
const DEFAULT_TTL = 5 * 60 * 1000;

// ══════════════════════════════════════════════════════════════
// CACHE KEY GENERATION
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Deterministic cache key from parameters ----
/**
 * Generates a deterministic cache key from a prefix and params object.
 * Sorts keys alphabetically and filters out undefined/null/empty values
 * to ensure consistent key generation regardless of parameter order.
 *
 * @param {string} prefix - Key prefix (e.g., "manga", "search")
 * @param {object} params - Parameters object to serialize
 * @returns {string} Formatted cache key (e.g., "manga:page=1&perPage=48")
 *
 * @example
 *   const key = getCacheKey("search", { keyword: "naruto", page: 1 });
 *   // Returns: "search:keyword=naruto&page=1"
 */
const getCacheKey = (prefix, params) => {
  const sorted = Object.keys(params)
    .sort()
    .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== '')
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return `${prefix}:${sorted}`;
};

// ══════════════════════════════════════════════════════════════
// CACHE OPERATIONS
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Retrieve cached data by key with TTL validation ----
/**
 * Retrieves data from cache if it exists and hasn't expired.
 * Automatically removes stale entries on access (lazy eviction).
 *
 * @param {string} key - The cache key to lookup
 * @returns {any|null} Cached data if valid, null if expired or missing
 *
 * @example
 *   const data = get("manga:page=1&perPage=48");
 *   if (data) {
 *     // Use cached data
 *   }
 */
const get = (key) => {
  const item = cache.get(key);
  if (!item) return null;

  // NOTE: Lazy eviction — delete stale entries on access
  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }

  return item.data;
};

// ---- FEATURE: Store data in cache with TTL expiry ----
/**
 * Stores data in cache with TTL-based expiry.
 * Overwrites existing data if key already exists.
 *
 * @param {string} key - The cache key to store under
 * @param {any} data - The data to cache (any serializable type)
 * @param {number} [ttl=DEFAULT_TTL] - Time-to-live in milliseconds
 * @returns {void}
 *
 * @example
 *   // Cache search results for 2 minutes
 *   set("search:one-piece", results, 120000);
 */
const set = (key, data, ttl = DEFAULT_TTL) => {
  cache.set(key, { data, expiresAt: Date.now() + ttl });
};

// ---- FEATURE: Check if key exists and is not expired ----
/**
 * Checks whether a valid (non-expired) entry exists for the given key.
 * Does not return the data — use get() for retrieval.
 *
 * @param {string} key - The cache key to check
 * @returns {boolean} True if valid entry exists, false otherwise
 *
 * @example
 *   if (has("manga:page=1")) {
 *     console.log("Cache hit");
 *   }
 */
const has = (key) => {
  const item = cache.get(key);
  if (!item) return false;
  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return false;
  }
  return true;
};

// ---- FEATURE: Get current number of cached entries ----
/**
 * Returns the current number of entries in the cache,
 * including potentially expired entries that haven't been evicted yet.
 *
 * @returns {number} Current cache size
 */
const size = () => cache.size;

// ══════════════════════════════════════════════════════════════
// CACHE MAINTENANCE
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Periodic cleanup of expired entries ----
/**
 * Removes all expired entries from the cache.
 * Runs automatically every 60 seconds via setInterval.
 *
 * @returns {void}
 */
const cleanup = () => {
  const now = Date.now();
  for (const [key, item] of cache.entries()) {
    if (now > item.expiresAt) cache.delete(key);
  }
};

// NOTE: Run cleanup every minute — prevents unbounded memory growth
setInterval(cleanup, 60 * 1000);

module.exports = { get, set, has, size, getCacheKey };

// ══════════════════════════════════════════════════════════════ END: cache.helper.js

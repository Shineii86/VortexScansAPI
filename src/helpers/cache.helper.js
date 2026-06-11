const cache = new Map();
const DEFAULT_TTL = 5 * 60 * 1000;

function getCacheKey(prefix, params) {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return `${prefix}:${sorted}`;
}

function get(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function set(key, data, ttl = DEFAULT_TTL) {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttl,
  });
}

function has(key) {
  const item = cache.get(key);
  if (!item) return false;
  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return false;
  }
  return true;
}

function clear() {
  cache.clear();
}

function size() {
  return cache.size;
}

function cleanup() {
  const now = Date.now();
  for (const [key, item] of cache.entries()) {
    if (now > item.expiresAt) {
      cache.delete(key);
    }
  }
}

setInterval(cleanup, 60 * 1000);

module.exports = { get, set, has, clear, size, getCacheKey };

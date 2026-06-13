/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — server.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Main entry point for the VortexScansAPI Express server.
 *   Configures CORS, middleware, static files, API routes
 *   (/api/v1/*), rate limiting with headers, pagination headers,
 *   and error handling.
 *
 * @exports
 *   None (side-effect: starts Express server)
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// ══════════════════════════════════════════════════════════════
// SERVER CONFIGURATION
// ══════════════════════════════════════════════════════════════

const app = express();
const PORT = process.env.PORT || 3000;
const START_TIME = Date.now();

// ══════════════════════════════════════════════════════════════
// CORS MIDDLEWARE
// ══════════════════════════════════════════════════════════════

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

// ══════════════════════════════════════════════════════════════
// SECURITY HEADERS
// ══════════════════════════════════════════════════════════════

app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// ══════════════════════════════════════════════════════════════
// STATIC FILES
// ══════════════════════════════════════════════════════════════

app.use(express.static(path.join(__dirname, "public"), { redirect: false }));

const publicDir = path.join(__dirname, "public");
app.get("/docs", (req, res) => res.sendFile(path.join(publicDir, "docs.html")));
app.get("/privacy", (req, res) => res.sendFile(path.join(publicDir, "privacy.html")));
app.get("/tos", (req, res) => res.sendFile(path.join(publicDir, "tos.html")));

// ══════════════════════════════════════════════════════════════
// RATE LIMITING (60 req/min per IP)
// ══════════════════════════════════════════════════════════════

const requestCounts = new Map();
const RATE_LIMIT = 60;
const RATE_WINDOW = 60000;

app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!requestCounts.has(ip)) requestCounts.set(ip, []);
  const timestamps = requestCounts.get(ip).filter((t) => now - t < RATE_WINDOW);
  requestCounts.set(ip, timestamps);

  const remaining = Math.max(0, RATE_LIMIT - timestamps.length);
  const resetAt = Math.ceil((timestamps[0] + RATE_WINDOW) / 1000);

  res.setHeader("X-RateLimit-Limit", RATE_LIMIT);
  res.setHeader("X-RateLimit-Remaining", remaining);
  res.setHeader("X-RateLimit-Reset", resetAt);

  if (timestamps.length >= RATE_LIMIT) {
    res.setHeader("Retry-After", Math.ceil((timestamps[0] + RATE_WINDOW - now) / 1000));
    return res.status(429).json({ success: false, error: "Rate limit exceeded. Try again later." });
  }

  timestamps.push(now);
  next();
});

// ══════════════════════════════════════════════════════════════
// RESPONSE HELPERS
// ══════════════════════════════════════════════════════════════

const success = (res, data, pagination = null, status = 200) => {
  const body = { success: true, data };
  if (pagination) {
    body.pagination = pagination;
    res.setHeader("X-Pagination-Total", pagination.total);
    res.setHeader("X-Pagination-Per-Page", pagination.perPage);
    res.setHeader("X-Pagination-Current-Page", pagination.currentPage);
    res.setHeader("X-Pagination-Last-Page", pagination.lastPage);
    res.setHeader("X-Pagination-Has-Next", pagination.hasNext);
    res.setHeader("X-Pagination-Has-Previous", pagination.hasPrevious);
  }
  return res.status(status).json(body);
};

const fail = (res, error, status = 500) =>
  res.status(status).json({ success: false, error });

// ══════════════════════════════════════════════════════════════
// CONTROLLERS
// ══════════════════════════════════════════════════════════════

const { getHome } = require("./src/controllers/home.controller");
const { getMangaList, getMangaBySlug, getMangaChapters } = require("./src/controllers/manga.controller");
const { getChapterImages } = require("./src/controllers/chapter.controller");
const { searchManga } = require("./src/controllers/search.controller");
const { filterManga } = require("./src/controllers/filter.controller");
const { getGenres, getStatus } = require("./src/controllers/genre.controller");
const { getCollections, getCollectionDetail } = require("./src/controllers/collection.controller");
const { getTeams } = require("./src/controllers/team.controller");

// ══════════════════════════════════════════════════════════════
// HEALTH CHECK
// ══════════════════════════════════════════════════════════════

app.get("/api/v1/health", async (req, res) => {
  const upstreamStart = Date.now();
  let upstreamStatus = "ok";
  let upstreamLatency = 0;

  try {
    const r = await fetch("https://api.vortexscans.org/api/genres");
    upstreamLatency = Date.now() - upstreamStart;
    if (!r.ok) upstreamStatus = "degraded";
  } catch {
    upstreamStatus = "unreachable";
    upstreamLatency = Date.now() - upstreamStart;
  }

  success(res, {
    status: upstreamStatus === "ok" ? "ok" : "degraded",
    version: "7.0.0",
    uptime: Math.floor((Date.now() - START_TIME) / 1000),
    upstream: {
      status: upstreamStatus,
      latencyMs: upstreamLatency,
      url: "https://api.vortexscans.org",
    },
  });
});

// ══════════════════════════════════════════════════════════════
// STATS
// ══════════════════════════════════════════════════════════════

app.get("/api/v1/stats", (req, res) => {
  success(res, {
    name: "VortexScansAPI",
    version: "7.0.0",
    uptime: Math.floor((Date.now() - START_TIME) / 1000),
    endpoints: [
      { path: "/api/v1/home", method: "GET", description: "Home page data" },
      { path: "/api/v1/manga", method: "GET", description: "List manga" },
      { path: "/api/v1/manga/:slug", method: "GET", description: "Manga detail" },
      { path: "/api/v1/manga/:slug/chapters", method: "GET", description: "Manga chapters" },
      { path: "/api/v1/chapter/:chapterId", method: "GET", description: "Chapter images" },
      { path: "/api/v1/search", method: "GET", description: "Search manga" },
      { path: "/api/v1/filter", method: "GET", description: "Filter manga" },
      { path: "/api/v1/genres", method: "GET", description: "All genres" },
      { path: "/api/v1/status", method: "GET", description: "Statuses & types" },
      { path: "/api/v1/collections", method: "GET", description: "All collections" },
      { path: "/api/v1/collections/:slug", method: "GET", description: "Collection detail" },
      { path: "/api/v1/teams", method: "GET", description: "All teams" },
      { path: "/api/v1/health", method: "GET", description: "Health check" },
      { path: "/api/v1/stats", method: "GET", description: "API stats" },
    ],
    rateLimit: { limit: RATE_LIMIT, window: "60s", scope: "per IP" },
    cache: { mangaList: "5min", chapter: "30min", genres: "1hr", collections: "30min" },
  });
});

// ══════════════════════════════════════════════════════════════
// API v1 ROUTES
// ══════════════════════════════════════════════════════════════

// ---- Home ----
app.get("/api/v1/home", async (req, res) => {
  try { success(res, await getHome()); }
  catch (e) { fail(res, e.message); }
});

// ---- Manga ----
app.get("/api/v1/manga", async (req, res) => {
  try {
    const { slug, action } = req.query;
    if (slug && action === "chapters") {
      const r = await getMangaChapters(slug, req.query);
      if (r.error) return fail(res, r.error, r.status);
      return success(res, r.data, r.pagination);
    }
    if (slug) {
      const r = await getMangaBySlug(slug, req.query);
      if (r.error) return fail(res, r.error, r.status);
      return success(res, r.data, r.pagination);
    }
    const r = await getMangaList(req.query);
    success(res, r.data, r.pagination);
  } catch (e) { fail(res, e.message); }
});

app.get("/api/v1/manga/:slug", async (req, res) => {
  try {
    const r = await getMangaBySlug(req.params.slug, req.query);
    if (r.error) return fail(res, r.error, r.status);
    success(res, r.data, r.pagination);
  } catch (e) { fail(res, e.message); }
});

// ---- Chapters (RESTful alias) ----
app.get("/api/v1/manga/:slug/chapters", async (req, res) => {
  try {
    const r = await getMangaChapters(req.params.slug, req.query);
    if (r.error) return fail(res, r.error, r.status);
    success(res, r.data, r.pagination);
  } catch (e) { fail(res, e.message); }
});

// ---- Chapter ----
app.get("/api/v1/chapter/:chapterId", async (req, res) => {
  try {
    const r = await getChapterImages(req.params.chapterId);
    if (r.error) return fail(res, r.error, r.status);
    success(res, r.data);
  } catch (e) { fail(res, e.message); }
});

// ---- Search ----
app.get("/api/v1/search", async (req, res) => {
  try {
    const r = await searchManga(req.query);
    if (r.error) return fail(res, r.error, 400);
    success(res, r.data, r.pagination);
  } catch (e) { fail(res, e.message); }
});

// ---- Filter ----
app.get("/api/v1/filter", async (req, res) => {
  try {
    const r = await filterManga(req.query);
    success(res, r.data, r.pagination);
  } catch (e) { fail(res, e.message); }
});

// ---- Genres ----
app.get("/api/v1/genres", async (req, res) => {
  try { success(res, await getGenres()); }
  catch (e) { fail(res, e.message); }
});

// ---- Status ----
app.get("/api/v1/status", async (req, res) => {
  try { success(res, await getStatus()); }
  catch (e) { fail(res, e.message); }
});

// ---- Collections ----
app.get("/api/v1/collections", async (req, res) => {
  try { success(res, await getCollections()); }
  catch (e) { fail(res, e.message); }
});

app.get("/api/v1/collections/:slug", async (req, res) => {
  try {
    const r = await getCollectionDetail(req.params.slug);
    if (r.error) return fail(res, r.error, r.status);
    success(res, r.data);
  } catch (e) { fail(res, e.message); }
});

// ---- Teams ----
app.get("/api/v1/teams", async (req, res) => {
  try {
    const r = await getTeams(req.query);
    success(res, r.data, r.pagination);
  } catch (e) { fail(res, e.message); }
});

// ══════════════════════════════════════════════════════════════
// LEGACY REDIRECTS (old routes → new v1 routes)
// ══════════════════════════════════════════════════════════════

app.get("/api", (req, res) => res.redirect(301, "/api/v1/stats"));
app.get("/api/home", (req, res) => res.redirect(301, "/api/v1/home"));
app.get("/api/manga", (req, res) => res.redirect(301, `/api/v1/manga${req.url.includes("?") ? "?" + req.url.split("?")[1] : ""}`));
app.get("/api/chapter", (req, res) => {
  const id = req.query.chapterId || req.query.id;
  if (id) return res.redirect(301, `/api/v1/chapter/${id}`);
  res.status(400).json({ success: false, error: "Use /api/v1/chapter/:chapterId" });
});
app.get("/api/search", (req, res) => res.redirect(301, `/api/v1/search${req.url.includes("?") ? "?" + req.url.split("?")[1] : ""}`));
app.get("/api/filter", (req, res) => res.redirect(301, `/api/v1/filter${req.url.includes("?") ? "?" + req.url.split("?")[1] : ""}`));
app.get("/api/genres", (req, res) => res.redirect(301, "/api/v1/genres"));
app.get("/api/status", (req, res) => res.redirect(301, "/api/v1/status"));

// ══════════════════════════════════════════════════════════════
// 404 HANDLER
// ══════════════════════════════════════════════════════════════

app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ success: false, error: "Endpoint not found" });
  }
  const notFoundPath = path.join(publicDir, "404.html");
  if (fs.existsSync(notFoundPath)) return res.status(404).sendFile(notFoundPath);
  res.sendFile(path.join(publicDir, "index.html"));
});

// ══════════════════════════════════════════════════════════════
// GLOBAL ERROR HANDLER
// ══════════════════════════════════════════════════════════════

app.use((err, req, res, next) => {
  console.error(err.stack);
  fail(res, err.message || "Internal server error", err.status || 500);
});

// ══════════════════════════════════════════════════════════════
// SERVER START
// ══════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.info(`VortexScansAPI v7.0.0 listening at ${PORT}`);
});

module.exports = app;

// ══════════════════════════════════════════════════════════════ END: server.js

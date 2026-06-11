/*
 * ======= • ======= • ======= • ======= • =======• =======
 * VortexScansAPI — server.js
 * Repository: https://github.com/Shineii86/VortexScansAPI
 *
 * @description
 *   Main entry point for the VortexScansAPI Express server.
 *   Configures CORS, middleware, static files, Swagger docs,
 *   API routes, and 404 handling. Starts the server on the
 *   configured port.
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

// ══════════════════════════════════════════════════════════════
// SERVER CONFIGURATION
// ══════════════════════════════════════════════════════════════

const app = express();
const PORT = process.env.PORT || 3000;

// ══════════════════════════════════════════════════════════════
// CORS MIDDLEWARE
// ══════════════════════════════════════════════════════════════

// NOTE: Single unified CORS middleware — handles all origin validation
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

// ---- FEATURE: Security headers ----
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

// ══════════════════════════════════════════════════════════════
// STATIC FILES
// ══════════════════════════════════════════════════════════════

app.use(express.static(path.join(__dirname, "public"), { redirect: false }));

// ══════════════════════════════════════════════════════════════
// CLEAN URL ROUTES
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Clean URL routes (no .html extension) ----
const fs = require("fs");
const publicDir = path.join(__dirname, "public");

app.get("/docs", (req, res) => {
  res.sendFile(path.join(publicDir, "docs.html"));
});

app.get("/privacy", (req, res) => {
  res.sendFile(path.join(publicDir, "privacy.html"));
});

app.get("/tos", (req, res) => {
  res.sendFile(path.join(publicDir, "tos.html"));
});

// ══════════════════════════════════════════════════════════════
// SWAGGER UI DOCS
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Interactive Swagger UI documentation at /docs ----
app.get("/docs", (req, res) => {
  res.sendFile(path.join(publicDir, "docs.html"));
});

// ══════════════════════════════════════════════════════════════
// RESPONSE HELPERS
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Standardized JSON response wrapper ----
/**
 * Wraps data in a standardized success JSON response.
 *
 * @param {object} res - Express response object
 * @param {*} data - The data to return in the response
 * @param {number} status - HTTP status code (default: 200)
 */
const jsonResponse = (res, data, status = 200) =>
  res.status(status).json({ success: true, results: data });

// ---- FEATURE: Standardized error response wrapper ----
/**
 * Returns a standardized error JSON response.
 *
 * @param {object} res - Express response object
 * @param {string} message - Error message to return
 * @param {number} status - HTTP status code (default: 500)
 */
const jsonError = (res, message = "Internal server error", status = 500) =>
  res.status(status).json({ success: false, message });

// ══════════════════════════════════════════════════════════════
// RATE LIMITING
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Rate limiting (100 requests per minute per IP) ----
const requestCounts = new Map();
app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60000;
  const maxRequests = 100;

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }

  const timestamps = requestCounts.get(ip).filter((t) => now - t < windowMs);
  requestCounts.set(ip, timestamps);

  if (timestamps.length >= maxRequests) {
    return res.status(429).json({
      success: false,
      message: "Rate limit exceeded. Try again later.",
    });
  }

  timestamps.push(now);
  next();
});

// ══════════════════════════════════════════════════════════════
// API ROUTES
// ══════════════════════════════════════════════════════════════

const { getApiInfo } = require("./src/controllers/info.controller");
const { getHome } = require("./src/controllers/home.controller");
const { getMangaList, getMangaBySlug, getMangaChapters } = require("./src/controllers/manga.controller");
const { getChapterImages } = require("./src/controllers/chapter.controller");
const { searchManga } = require("./src/controllers/search.controller");
const { filterManga } = require("./src/controllers/filter.controller");
const { getGenres, getStatus } = require("./src/controllers/genre.controller");

// ---- FEATURE: GET /api — API info ----
app.get("/api", async (req, res) => {
  try {
    const result = await getApiInfo();
    jsonResponse(res, result);
  } catch (err) {
    jsonError(res, err.message);
  }
});

// ---- FEATURE: GET /api/home — Home page data ----
app.get("/api/home", async (req, res) => {
  try {
    const result = await getHome();
    jsonResponse(res, result);
  } catch (err) {
    jsonError(res, err.message);
  }
});

// ---- FEATURE: GET /api/manga — List, detail, or chapters ----
app.get("/api/manga", async (req, res) => {
  try {
    const { slug, action } = req.query;

    if (slug && action === "chapters") {
      const result = await getMangaChapters(slug, req.query);
      return res.status(result.status || 200).json(result);
    }

    if (slug) {
      const result = await getMangaBySlug(slug, req.query);
      return res.status(result.status || 200).json(result);
    }

    const result = await getMangaList(req.query);
    jsonResponse(res, result);
  } catch (err) {
    jsonError(res, err.message);
  }
});

// ---- FEATURE: GET /api/chapter — Chapter images ----
app.get("/api/chapter", async (req, res) => {
  try {
    const { slug, chapter } = req.query;

    if (!slug || !chapter) {
      return jsonError(res, "slug and chapter parameters are required", 400);
    }

    const result = await getChapterImages(slug, chapter);
    res.status(result.status || 200).json(result);
  } catch (err) {
    jsonError(res, err.message);
  }
});

// ---- FEATURE: GET /api/search — Search manga ----
app.get("/api/search", async (req, res) => {
  try {
    const result = await searchManga(req.query);
    jsonResponse(res, result);
  } catch (err) {
    jsonError(res, err.message);
  }
});

// ---- FEATURE: GET /api/filter — Advanced filter ----
app.get("/api/filter", async (req, res) => {
  try {
    const result = await filterManga(req.query);
    jsonResponse(res, result);
  } catch (err) {
    jsonError(res, err.message);
  }
});

// ---- FEATURE: GET /api/genres — All genres ----
app.get("/api/genres", async (req, res) => {
  try {
    const result = await getGenres();
    jsonResponse(res, result);
  } catch (err) {
    jsonError(res, err.message);
  }
});

// ---- FEATURE: GET /api/status — Statuses and types ----
app.get("/api/status", async (req, res) => {
  try {
    const result = await getStatus();
    jsonResponse(res, result);
  } catch (err) {
    jsonError(res, err.message);
  }
});

// ══════════════════════════════════════════════════════════════
// 404 HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Global error handler ----
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ---- FEATURE: Catch-all 404 handler for undefined routes ----
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      message: "Endpoint not found",
    });
  }
  const notFoundPath = path.join(publicDir, "404.html");
  if (fs.existsSync(notFoundPath)) {
    return res.status(404).sendFile(notFoundPath);
  }
  res.sendFile(path.join(publicDir, "index.html"));
});

// ══════════════════════════════════════════════════════════════
// SERVER START
// ══════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.info(`VortexScansAPI listening at ${PORT}`);
});

module.exports = app;

// ══════════════════════════════════════════════════════════════ END: server.js

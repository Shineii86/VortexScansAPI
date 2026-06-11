function extractChapterImages(html) {
  const imageRegex = /https:\/\/storage\.vortexscans\.org\/upload\/series\/[^"'\s]+page-[^"'\s]+\.webp/g;
  const matches = html.match(imageRegex) || [];

  const seen = new Set();
  const images = [];

  for (const url of matches) {
    if (!seen.has(url)) {
      seen.add(url);
      images.push(url);
    }
  }

  return images.map((url, index) => ({
    page: index + 1,
    url,
  }));
}

function extractChapterInfo(html) {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(' - Vortex Scans', '').trim() : null;

  const prevMatch = html.match(/href="[^"]*\/(chapter-[^"]+)"[^>]*>\s*Prev/i);
  const nextMatch = html.match(/href="[^"]*\/(chapter-[^"]+)"[^>]*>\s*Next/i);

  return {
    title,
    prevChapter: prevMatch ? prevMatch[1] : null,
    nextChapter: nextMatch ? nextMatch[1] : null,
  };
}

module.exports = { extractChapterImages, extractChapterInfo };

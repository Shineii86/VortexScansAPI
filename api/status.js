export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=172800');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.json({
    success: true,
    data: {
      statuses: [
        { id: 'ongoing', name: 'Ongoing' },
        { id: 'hiatus', name: 'Hiatus' },
        { id: 'completed', name: 'Completed' },
      ],
      types: [
        { id: 'manhwa', name: 'Manhwa' },
        { id: 'manga', name: 'Manga' },
        { id: 'manhua', name: 'Manhua' },
      ],
    },
  });
}

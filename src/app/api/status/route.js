export async function GET() {
  const statuses = [
    { id: 'ongoing', name: 'Ongoing', description: 'Series currently being updated' },
    { id: 'hiatus', name: 'Hiatus', description: 'Series temporarily on hold' },
    { id: 'completed', name: 'Completed', description: 'Series that has finished' },
    { id: 'dropped', name: 'Dropped', description: 'Series that has been dropped' },
  ];

  const types = [
    { id: 'manhwa', name: 'Manhwa', description: 'Korean comics' },
    { id: 'manga', name: 'Manga', description: 'Japanese comics' },
    { id: 'manhua', name: 'Manhua', description: 'Chinese comics' },
  ];

  return Response.json(
    {
      success: true,
      data: {
        statuses,
        types,
      },
      usage: {
        filterByStatus: '/api/manga?status=ongoing',
        filterByType: '/api/manga?type=manhwa',
      },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
      },
    }
  );
}

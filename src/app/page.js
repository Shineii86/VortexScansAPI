export default function Home() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1>VortexScans API</h1>
      <p>Unofficial REST API for <a href="https://vortexscans.org">Vortex Scans</a></p>
      
      <h2>Endpoints</h2>
      
      <h3>List Manga</h3>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '4px' }}>
{`GET /api/manga?page=1&limit=48&type=manhwa&status=ongoing`}
      </pre>
      <p><strong>Parameters:</strong></p>
      <ul>
        <li><code>page</code> - Page number (default: 1)</li>
        <li><code>limit</code> - Items per page (default: 48)</li>
        <li><code>search</code> - Search by title</li>
        <li><code>type</code> - Filter: manhwa, manga, manhua</li>
        <li><code>status</code> - Filter: ongoing, hiatus, completed</li>
        <li><code>genre</code> - Filter by genre name</li>
        <li><code>order</code> - Sort field</li>
        <li><code>direction</code> - asc or desc</li>
        <li><code>hot</code> - Filter hot series (true/false)</li>
      </ul>

      <h3>Manga Detail</h3>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '4px' }}>
{`GET /api/manga/{slug}?page=1&limit=50`}
      </pre>

      <h3>Search Manga</h3>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '4px' }}>
{`GET /api/manga?search=reality+quest`}
      </pre>

      <h3>Genres</h3>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '4px' }}>
{`GET /api/genres`}
      </pre>

      <h3>Status & Types</h3>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '4px' }}>
{`GET /api/status`}
      </pre>

      <h2>Links</h2>
      <ul>
        <li><a href="https://github.com/Shineii86/VortexScansAPI">GitHub</a></li>
        <li><a href="https://vortexscans.org">Vortex Scans</a></li>
      </ul>
      
      <p style={{ marginTop: '2rem', color: '#666' }}>
        Made by <strong>Shineii86</strong>
      </p>
    </div>
  );
}

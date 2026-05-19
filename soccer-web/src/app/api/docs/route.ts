export async function GET() {
  const html = `<!doctype html>
  <html>
  <head><meta charset="utf-8"><title>Soccer Planner API</title></head>
  <body>
    <h1>Soccer Planner API (minimal)</h1>
    <ul>
      <li>POST /api/auth/login - body: {"email":"...","password":"..."} → { token, user }</li>
      <li>GET /api/matches?page=1&pageSize=20 - Authorization: Bearer &lt;token&gt;</li>
      <li>GET /api/matches/&lt;id&gt; - Authorization: Bearer &lt;token&gt;</li>
      <li>POST /api/matches/&lt;id&gt;/join - Authorization: Bearer &lt;token&gt;</li>
      <li>POST /api/matches/&lt;id&gt;/leave - Authorization: Bearer &lt;token&gt;</li>
      <li>POST /api/matches/&lt;id&gt;/slots - body: {"extraSlots":1} - Authorization: Bearer &lt;token&gt;</li>
    </ul>
  </body>
  </html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

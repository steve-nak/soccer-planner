const docsHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Soccer Planner API Documentation</title>
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial;margin:24px;color:#111}
      pre{background:#f6f8fa;padding:12px;border-radius:6px;overflow:auto}
      code{background:#f1f3f5;padding:2px 6px;border-radius:4px}
      h1,h2{color:#0b5cff}
      .endpoint{margin-bottom:18px}
    </style>
  </head>
  <body>
    <h1>Soccer Planner - Minimal Mobile API</h1>
    <p>This document describes the minimal REST API used by the mobile client.</p>

    <h2>Authentication</h2>
    <p>All protected endpoints require a Bearer JWT token in the <code>Authorization</code> header:</p>
    <pre>Authorization: Bearer &lt;token&gt;</pre>

    <h2 class="endpoint">POST /api/auth/login</h2>
    <p>Authenticate with email and password. Returns a JWT token and user info.</p>
    <p>Request JSON:</p>
    <pre>{"email":"user@example.com","password":"your_password"}</pre>
    <p>Successful response (200):</p>
    <pre>{
  "token": "&lt;jwt-token&gt;",
  "user": { "userId": 1, "email": "user@example.com", "name": "Joe" }
}</pre>

    <h2 class="endpoint">GET /api/matches</h2>
    <p>List active matches (upcoming/current and not canceled) for the authenticated user's groups.</p>
    <p>Query parameters: <code>page</code> (default 1), <code>pageSize</code> (default 20, max 100).</p>
    <p>Headers: <code>Authorization: Bearer &lt;token&gt;</code></p>
    <p>Response:</p>
    <pre>{
  "total": 42,
  "page": 1,
  "pageSize": 20,
  "items": [ /* array of matches with summary fields */ ]
}</pre>

    <h2 class="endpoint">GET /api/matches/&lt;id&gt;</h2>
    <p>Get full match details including players and comments. Requires auth.</p>
    <p>Response example:</p>
    <pre>{
  "id": 5,
  "groupId": 2,
  "groupTitle": "Neighborhood Saturday",
  "date": "2026-05-20T10:00:00.000Z",
  "location": "Local Park",
  "capacity": 12,
  "canceled": false,
  "state": "upcoming",
  "isActive": true,
  "playerCount": 8,
  "capacityStatus": "under",
  "players": [{ "userId": 3, "userName": "Ann", "extraSlots": 1 }],
  "comments": [{ "id": 1, "userId": 3, "userName": "Ann", "text": "See you there" }],
  "joinedByCurrentUser": false
}</pre>

    <h2 class="endpoint">POST /api/matches/&lt;id&gt;/join</h2>
    <p>Join an active match. Requires auth and the user must be a group member.</p>
    <p>Responses: 200 on success with message, 400 if not open, 403 if not a group member.</p>

    <h2 class="endpoint">POST /api/matches/&lt;id&gt;/leave</h2>
    <p>Leave a match the user previously joined. Requires auth.</p>

    <h2 class="endpoint">POST /api/matches/&lt;id&gt;/slots</h2>
    <p>Update extra slots (friends) for the joined user. Request JSON:</p>
    <pre>{"extraSlots": 1}</pre>
    <p>Negative values are clamped to 0.</p>

    <h2>Errors and status codes</h2>
    <ul>
      <li>401 - Unauthorized (missing/invalid token)</li>
      <li>403 - Forbidden (not a group member for join)</li>
      <li>404 - Not found (match doesn't exist)</li>
      <li>400 - Bad request (invalid input)</li>
    </ul>

    <h2>Notes for mobile clients</h2>
    <ul>
      <li>Always store the JWT token securely and send it as Bearer token.</li>
      <li>Use paging for match lists to reduce payload size.</li>
      <li>The API is intentionally minimal; additional features will be added later.</li>
    </ul>
  </body>
</html>`;

export async function GET() {
  return new Response(docsHtml, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

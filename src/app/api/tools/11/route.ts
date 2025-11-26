export async function POST(req: Request) {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MDgwM2E5Ni1lMDcxLTRiODgtOTBhOS1lN2Q4ZGRiOTkyYjAiLCJleHAiOjE3NjM2MDA4MzUsInVzZXJfbmFtZSI6ImFkbWluIiwicm9sZV9uYW1lIjoiUk9MRV9BRE1JTiJ9.YvsMmfFthmPc5bv88s9vwPtMqjK2PvuI85voNsXaWp0';

  if (!token) {
    alert('token fail');
  }
  try {
    const body = await req.json();

    const response = await fetch('http://localhost:8000/tool11/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return new Response(JSON.stringify({ error: 'Missing domain parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = `${domain}/p/index.php?v=${Date.now()}`;
    const response = await fetch(url);
    const available = response.status === 200 && (await response.text()).length > 0;

    return new Response(JSON.stringify({ domain, available }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error checking domain:', error);
    return new Response(JSON.stringify({ domain, available: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
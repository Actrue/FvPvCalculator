import { NextRequest } from 'next/server';

const domains = [
  'https://z-lib.gd',
  'https://1lib.sk',
  'https://z-lib.fm',
  'https://z-lib.gl',
  'https://z-lib.fo',
  'https://z-library.sk',
  'https://zh.z-library.ec'
];

async function checkDomain(domain: string): Promise<boolean> {
  try {
    const url = `${domain}/p/index.php?v=${Date.now()}`;
    const response = await fetch(url);
    return response.status === 200 && (await response.text()).length > 0;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  for (const domain of domains) {
    const available = await checkDomain(domain);
    if (available) {
      return new Response(JSON.stringify({ domain }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  return new Response(JSON.stringify({ domain: null }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
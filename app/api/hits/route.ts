import { NextResponse } from 'next/server';
import { incrHit, isKnownId } from '@/lib/hits';

// Records a site visit. Node runtime for the Upstash client; never cached so
// every hit is counted.
//
// CORS is open (`*`): each bar-for-<slug>.vercel.app site beacons here from its
// own origin, and there are no cookies/credentials to protect. `isKnownId`
// already rejects any id not in SITES, so the endpoint can only ever bump a
// counter that already exists — a permissive origin can't be abused.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
} as const;

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  let id: unknown;
  try {
    ({ id } = await request.json());
  } catch {
    return NextResponse.json(
      { error: 'bad request' },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  if (!isKnownId(id)) {
    return NextResponse.json(
      { error: 'unknown id' },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const count = await incrHit(id);
  return NextResponse.json({ id, count }, { headers: CORS_HEADERS });
}

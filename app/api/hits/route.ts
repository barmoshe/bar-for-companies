import { NextResponse } from 'next/server';
import { incrHit, isKnownId } from '@/lib/hits';

// First (and only) API route: records a card click. Node runtime for the
// Upstash client; never cached so every hit is counted.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let id: unknown;
  try {
    ({ id } = await request.json());
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }

  if (!isKnownId(id)) {
    return NextResponse.json({ error: 'unknown id' }, { status: 400 });
  }

  const count = await incrHit(id);
  return NextResponse.json({ id, count });
}

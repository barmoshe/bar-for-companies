import { Redis } from '@upstash/redis';
import { SITES } from '@/lib/sites';

// Per-card popularity counter. One Redis hash, field = Site.id, value = clicks.
// The store is optional: with no Upstash env (local dev, or before the Vercel
// integration is connected) every helper degrades to empty/no-op so the site
// still renders — badges just read 0.
const HITS_KEY = 'gallery:hits';

// The Vercel Upstash integration's env-var names vary by how it was linked, so
// accept both the KV-compatible names and Upstash's own names.
const url =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

// Only these ids are ever written or read, so a stray field can't inflate the hash.
const VALID_IDS = new Set(SITES.map((s) => s.id));

export function isKnownId(id: unknown): id is string {
  return typeof id === 'string' && VALID_IDS.has(id);
}

/** All card counts in one round-trip. Returns {} when the store is unavailable. */
export async function getAllHits(): Promise<Record<string, number>> {
  if (!redis) return {};
  try {
    const raw = await redis.hgetall<Record<string, number | string>>(HITS_KEY);
    if (!raw) return {};
    const out: Record<string, number> = {};
    for (const [id, value] of Object.entries(raw)) {
      if (!VALID_IDS.has(id)) continue;
      const n = typeof value === 'number' ? value : Number(value);
      if (Number.isFinite(n)) out[id] = n;
    }
    return out;
  } catch {
    return {};
  }
}

/** +1 for one card, returns the new count (null when the store is unavailable). */
export async function incrHit(id: string): Promise<number | null> {
  if (!redis || !isKnownId(id)) return null;
  try {
    return await redis.hincrby(HITS_KEY, id, 1);
  } catch {
    return null;
  }
}

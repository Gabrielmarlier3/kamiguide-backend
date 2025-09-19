import type { Redis } from 'ioredis';

export async function getOrSet<T>(
  redis: Redis,
  key: string,
  ttlSec: number,
  loader: () => Promise<T>,
): Promise<T> {
  const hit = await redis.get(key);
  if (hit) return JSON.parse(hit) as T;

  //Simple distributed lock to not overload the source with many requests
  const lockKey = `${key}:lock`;
  const gotLock = await redis.set(lockKey, '1', 'PX', 3000, 'NX');
  if (!gotLock) {
    //wait a bit and try get if someone else already loaded the cache return else load ourselves
    await new Promise((r) => setTimeout(r, 1000));
    const retry = await redis.get(key);
    if (retry) return JSON.parse(retry) as T;
  }

  try {
    const payload = await loader();
    const jitter = Math.floor(Math.random() * 300); // até +5 min
    await redis.set(
      key,
      JSON.stringify({ payload, fetchedAt: new Date().toISOString() }),
      'EX',
      ttlSec + jitter,
    );
    return { payload, fetchedAt: new Date().toISOString() } as any as T;
  } finally {
    await redis.del(lockKey).catch(() => {});
  }
}

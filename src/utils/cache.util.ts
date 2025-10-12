import type { Redis } from 'ioredis';
import { sleep } from './sleep.util';

export async function getOrSet<T>(
  redis: Redis,
  key: string,
  ttlSec: number,
  loader: () => Promise<T>,
): Promise<{ payload: T; fetchedAt: string }> {
  const hit = await redis.get(key);
  if (hit) {
    const response = JSON.parse(hit);
    if (!response?.payload) {
      return {
        payload: response,
        fetchedAt: new Date().toISOString(),
      };
    }
    return response as { payload: T; fetchedAt: string };
  }

  //Simple distributed lock to not overload the source with many requests
  const lockKey = `${key}:lock`;
  const gotLock = await redis.set(lockKey, '1', 'PX', 3000, 'NX');
  if (!gotLock) {
    //wait a bit and try get if someone else already loaded the cache return else load ourselves
    await sleep(1000);
    const retry = await redis.get(key);
    if (retry) {
      const response = JSON.parse(retry);
      if (!response?.payload) {
        return {
          payload: response,
          fetchedAt: new Date().toISOString(),
        };
      }
      return response as { payload: T; fetchedAt: string };
    }
  }

  try {
    const payload = await loader();
    const jitter = Math.floor(Math.random() * 300); // até +5 min
    await redis.set(
      key,
      JSON.stringify({ payload: payload, fetchedAt: new Date().toISOString() }),
      'EX',
      ttlSec + jitter,
    );
    return { payload: payload, fetchedAt: new Date().toISOString() } as any as {
      payload: T;
      fetchedAt: string;
    };
  } finally {
    await redis.del(lockKey).catch(() => {});
  }
}

// Salvar direto
export async function cacheSet(
  redis: Redis,
  key: string,
  ttlSec: number,
  value: any,
): Promise<void> {
  await redis.set(key, JSON.stringify(value), 'EX', ttlSec);
}

// Pegar direto
export async function cacheGet<T>(
  redis: Redis,
  key: string,
): Promise<T | null> {
  const hit = await redis.get(key);
  return hit ? (JSON.parse(hit) as T) : null;
}

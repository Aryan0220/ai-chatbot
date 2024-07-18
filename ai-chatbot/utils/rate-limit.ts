import { kv } from '@vercel/kv';

const RATE_LIMIT_WINDOW = 3600;
const MAX_REQUESTS_PER_WINDOW = 3;

export async function canGenerateImage(userId: string): Promise<boolean> {
  const key = `user:${userId}:rate-limit`;
  const currentTimestamp = Math.floor(Date.now() / 1000);

  const rateLimitData = await kv.get<Record<string, number>>(key) || {};

  const updatedData = Object.fromEntries(
    Object.entries(rateLimitData).filter(([timestamp]) => parseInt(timestamp) > currentTimestamp - RATE_LIMIT_WINDOW)
  );

  const requestCount = Object.keys(updatedData).length;
  if (requestCount >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  updatedData[currentTimestamp] = currentTimestamp;
  await kv.set(key, updatedData);

  return true;
}

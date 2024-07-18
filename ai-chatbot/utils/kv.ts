import { kv } from '@vercel/kv';

export async function storeUserHistory(userId: string, imageUrl: string) {
  await kv.set(`user:${userId}:history`, imageUrl);
}

export async function getUserHistory(userId: string) {
  return await kv.get(`user:${userId}:history`);
}

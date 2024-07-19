import axios from 'axios';

const KV_REST_API_URL = "https://outgoing-muskrat-41119.upstash.io"
const KV_REST_API_TOKEN = "AaCfAAIncDEwODA5N2IxMDM3ZDY0NzM5OTQ0OWRiOTk2NTg4ODVkOHAxNDExMTk"

interface GenerationHistoryItem {
  prompt: string;
  imageUrl: string;
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${KV_REST_API_TOKEN}`,
};

export const storeUserHistory = async (userId: string, prompt: string, imageUrl: string) => {
  const historyKey = `user:${userId}:history`;
  const response = await axios.get(`${KV_REST_API_URL}/get/${historyKey}`, { headers });
  const history: GenerationHistoryItem[] = response.data.result ? JSON.parse(response.data.result) : [];
  history.push({ prompt, imageUrl });
  await axios.put(`${KV_REST_API_URL}/set/${historyKey}`, JSON.stringify(history), { headers });
};

export const resetGenerationCounts = async (userId: string) => {
  const countKey = `user:${userId}:generationCount`;
  const response = await axios.get(`${KV_REST_API_URL}/get/${countKey}`, { headers });
  let count = 0;
  await axios.put(`${KV_REST_API_URL}/set/${countKey}`, count, { headers });
}

export const getUserHistory = async (userId: string) => {
  const historyKey = `user:${userId}:history`;
  const response = await axios.get(`${KV_REST_API_URL}/get/${historyKey}`, { headers });
  return response.data.result ? JSON.parse(response.data.result) : [];
};

export const getUserGenerationCount = async (userId: string) => {
  const countKey = `user:${userId}:generationCount`;
  const response = await axios.get(`${KV_REST_API_URL}/get/${countKey}`, { headers });
  return response.data.result ? Number(response.data.result) : 0;
};

export const incrementUserGenerationCount = async (userId: string) => {
  const countKey = `user:${userId}:generationCount`;
  const response = await axios.get(`${KV_REST_API_URL}/get/${countKey}`, { headers });
  let count = response.data.result ? Number(response.data.result) : 0;
  count += 1;
  await axios.put(`${KV_REST_API_URL}/set/${countKey}`, count, { headers });
};


import axios from 'axios';

const KV_REST_API_URL = "https://outgoing-muskrat-41119.upstash.io";
const KV_REST_API_TOKEN = "AaCfAAIncDEwODA5N2IxMDM3ZDY0NzM5OTQ0OWRiOTk2NTg4ODVkOHAxNDExMTk";

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${KV_REST_API_TOKEN}`,
};

const SESSION_EXPIRY_MS = 1000 * 60 * 60; // 1 hour

export const setSession = async (sessionId: string, data: any) => {
  const expiration = Date.now() + SESSION_EXPIRY_MS;
  const sessionData = { ...data, expiration };
  console.log(sessionData);
  await axios.put(`${KV_REST_API_URL}/set/session:${sessionId}`, JSON.stringify(sessionData), { headers });
};

export const getSession = async (sessionId: string) => {
  try {
    const response = await axios.get(`${KV_REST_API_URL}/get/session:${sessionId}`, { headers });
    
    const sessionData = response.data.result ? JSON.parse(response.data.result) : null;

    if (sessionData) {
        console.log(sessionData);
      const { expiration, ...data } = sessionData;
      if (Date.now() < expiration) {
        return data;
      } else {
        await deleteSession(sessionId); // Delete expired session
      }
    }
  } catch (error) {
    console.error('Error fetching session:', error);
  }
  return null;
};

export const deleteSession = async (sessionId: string) => {
  await axios.delete(`${KV_REST_API_URL}/delete/session:${sessionId}`, { headers });
};

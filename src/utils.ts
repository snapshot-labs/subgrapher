import fetch from 'node-fetch';
import https from 'node:https';
import { createHash } from 'crypto';
import { capture } from '@snapshot-labs/snapshot-sentry';

export function sha256(str) {
  return createHash('sha256').update(str).digest('hex');
}

export async function graphqlQuery(url: string, query) {
  const res = await fetchWithKeepAlive(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  let responseData: any = await res.text();
  try {
    responseData = JSON.parse(responseData);
  } catch (e) {
    capture(e);
    throw new Error(`Text response: ${responseData}`);
  }
  return responseData;
}

export function subgraphError(res, error: null | string = null) {
  return res.status(500).json({ errors: [{ message: error }] });
}

const httpsAgent = new https.Agent({ keepAlive: true });
const fetchWithKeepAlive = (uri: any, options: any = {}) => {
  return fetch(uri, { agent: httpsAgent, ...options });
};

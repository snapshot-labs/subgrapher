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
    timeout: 30e3,
    body: JSON.stringify({ query })
  });
  let responseData: any = await res.text();
  try {
    responseData = JSON.parse(responseData);
  } catch (e) {
    capture({ error: { code: res.status, message: res.statusText } }, { url });

    if (!res.ok) {
      throw new Error(`Unable to connect to ${url}, code: ${res.status}`);
    } else {
      throw new Error(`Text response: ${responseData}`);
    }
  }
  return responseData;
}

export function subgraphError(res, error: null | string = null, code = 500) {
  return res.status(code).json({ errors: [{ message: error }] });
}

const httpsAgent = new https.Agent({ keepAlive: true });
const fetchWithKeepAlive = (uri: any, options: any = {}) => {
  return fetch(uri, { agent: httpsAgent, ...options });
};

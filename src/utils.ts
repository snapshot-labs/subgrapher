import fetch from 'node-fetch';
import https from 'node:https';
import { createHash } from 'crypto';
import { capture } from '@snapshot-labs/snapshot-sentry';
import delegationSubgraphs from './helpers/delegationSubgraphs';
import upgradedSubgraphs from './helpers/upgradedSubgraphs';

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

export function subgraphError(res, error: any = 'Unknown error', code = 500) {
  return res.status(code).json(error?.errors ? error : { errors: [{ message: error }] });
}

const httpsAgent = new https.Agent({ keepAlive: true });
const fetchWithKeepAlive = (uri: any, options: any = {}) => {
  return fetch(uri, { agent: httpsAgent, ...options });
};

export function buildURL(url: string): string {
  if (url.startsWith('http')) throw new Error('Invalid subgraph');
  if (url.startsWith('delegation')) {
    const network = url.split('/')[1];
    if (!network) throw new Error('Invalid network');
    if (network && delegationSubgraphs[network]) return delegationSubgraphs[network];
    if (network && !delegationSubgraphs[network]) throw new Error('Invalid network');
  }
  if (url.startsWith('subgraph')) {
    const network = url.split('/')[1];
    if (!network || !upgradedSubgraphs[network]) throw new Error('Invalid network');
    const subgraph = url.split('/')[2];
    if (!subgraph) throw new Error('Invalid subgraph');
    return upgradedSubgraphs[network] + subgraph;
  }
  throw new Error('Invalid subgraph');
}

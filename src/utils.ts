import { createHash } from 'crypto';
import fetch from 'cross-fetch';

export function sha256(str) {
  return createHash('sha256').update(str).digest('hex');
}

export async function graphqlQuery(url: string, query) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  return await res.json();
}

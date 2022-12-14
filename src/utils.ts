import fetch from 'cross-fetch';
import { createHash } from 'crypto';

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
  let responseData: any = await res.text();
  try {
    responseData = JSON.parse(responseData);
  } catch (e) {
    throw new Error(`Text response: ${responseData}`);
  }
  return responseData;
}

export function subgraphError(res, error: null | string = null, errors = []) {
  if (error) return res.status(500).json({ errors: [{ message: error }] });
  return res.status(500).json({
    errors
  });
}

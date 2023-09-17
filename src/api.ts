import express from 'express';
import { parse, print } from 'graphql';
import { version } from '../package.json';
import { get, set } from './aws';
import { graphqlQuery, sha256, subgraphError } from './utils';
import serve from './helpers/requestDeduplicator';
import { capture } from '@snapshot-labs/snapshot-sentry';

const router = express.Router();

const withCache = !!process.env.AWS_REGION;

router.get('/', (req, res) => {
  const commit = process.env.COMMIT_HASH ?? '';
  const v = commit ? `${version}#${commit.substring(0, 7)}` : version;
  res.json({
    version: v
  });
});

router.post('/*', async (req, res) => {
  let url = req.params[0];
  let { query } = req.body;
  if (!url) return subgraphError(res, 'No subgraph URL provided');
  if (!query) return subgraphError(res, 'No query provided');

  url = url.startsWith('http') ? url : `https://${url}`;

  let queryObj: undefined | any;
  try {
    queryObj = parse(query);
  } catch (error: any) {
    return subgraphError(res, `Query parse error: ${error.message}`);
  }

  query = print(queryObj);
  const key = sha256(`${url}:${query}`);

  // @ts-ignore
  const caching =
    withCache &&
    queryObj.definitions[0].selectionSet.selections.every(selection =>
      selection.arguments.some(argument => argument.name.value === 'block')
    );
  try {
    const result: any = await serve(key, getData, [url, query, key, caching]);
    if (result.errors) {
      capture(result);
      return res.status(500).json(result);
    }
    return res.json(result);
  } catch (error: any) {
    return subgraphError(res, error.message || 'Unknown error');
  }
});

const getData = async (url: string, query: string, key: string, caching: boolean) => {
  let cache;
  if (caching) {
    cache = await get(key);

    if (cache) {
      return cache;
    }
  }
  const result = await graphqlQuery(url, query);
  if (result?.data && caching) set(key, result).catch(capture);

  return result;
};

export default router;

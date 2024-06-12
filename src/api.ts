import express from 'express';
import { parse, print } from 'graphql';
import { version } from '../package.json';
import { get, set } from './aws';
import { buildURL, graphqlQuery, sha256, subgraphError } from './utils';
import serve from './helpers/requestDeduplicator';
import { capture } from '@snapshot-labs/snapshot-sentry';
import { cacheHitCount } from './helpers/metrics';

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
  const { variables = {} } = req.body;
  if (!url) return subgraphError(res, 'No subgraph URL provided', 400);
  if (!query) return subgraphError(res, 'No query provided', 400);
  try {
    url = buildURL(url);
  } catch (error: any) {
    return subgraphError(res, error.message, 400);
  }
  let queryObj: any;
  try {
    queryObj = parse(query);
  } catch (error: any) {
    return subgraphError(res, `Query parse error: ${error.message}`, 400);
  }

  query = print(queryObj);
  const key = sha256(`${url}:${query}:${JSON.stringify(variables)}`);

  // @ts-ignore
  const caching =
    withCache &&
    queryObj.definitions[0].selectionSet.selections.every(selection =>
      selection.arguments.some(argument => argument.name.value === 'block')
    );
  try {
    const result: any = await serve(key, getData, [url, query, variables, key, caching]);
    if (result.errors) {
      capture(new Error('GraphQl error'), result.errors);
      return subgraphError(res, result, 400);
    }
    return res.json(result);
  } catch (error: any) {
    return subgraphError(res, error);
  }
});

const getData = async (
  url: string,
  query: string,
  variables = {},
  key: string,
  caching: boolean
) => {
  let cache;
  if (caching) {
    cache = await get(key);

    if (cache) {
      cacheHitCount.inc({ status: 'HIT' });
      return cache;
    }

    cacheHitCount.inc({ status: 'MISS' });
  }
  const result = await graphqlQuery(url, query, variables);
  if (result?.data && caching) set(key, result).catch(capture);

  return result;
};

export default router;

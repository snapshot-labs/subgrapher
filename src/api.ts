import express from 'express';
import { parse, print } from 'graphql';
import { version } from '../package.json';
import { get, set } from './aws';
import { graphqlQuery, sha256, subgraphError } from './utils';

const router = express.Router();

let cached = 0;

router.get('/', (req, res) => {
  const commit = process.env.COMMIT_HASH || '';
  const v = commit ? `${version}#${commit.substr(0, 7)}` : version;
  res.json({
    cached,
    version: v
  });
});

router.post('/*', async (req, res) => {
  let url = req.params[0];
  const { query } = req.body;
  if (!url) return subgraphError(res, 'No subgraph URL provided');
  if (!query) return subgraphError(res, 'No query provided');

  url = url.startsWith('http') ? url : `https://${url}`;

  let obj: undefined | any;
  try {
    obj = parse(query);
  } catch (error: any) {
    return subgraphError(res, `Query parse error: ${error.message}`);
  }

  const str = print(obj);
  const key = sha256(`${url}:${str}`);

  console.log('Request', { key, url });

  // @ts-ignore
  const caching = obj.definitions[0].selectionSet.selections.every(selection =>
    selection.arguments.some(argument => argument.name.value === 'block')
  );

  let cache;
  if (caching) {
    cache = await get(key);

    if (cache) {
      cached++;
      console.log('Return cache', { key });
      return res.json(cache);
    }
  }

  let result;
  try {
    result = await graphqlQuery(url, str);
    if (result.errors) {
      return subgraphError(res, null, result.errors);
    }
  } catch (error: any) {
    console.log(`subgraphRequest Error: ${error.message}`);
    return subgraphError(res, `subgraphRequest Error: ${error.message}`);
  }

  if (result?.data && caching) {
    set(key, result).then(() => console.log('Cache stored', { key }));
  }

  return res.json(result);
});

export default router;

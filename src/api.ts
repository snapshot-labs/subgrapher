import express from 'express';
import { parse, print } from 'graphql';
import { graphqlQuery, sha256 } from './utils';
import { get, set } from './aws';

const router = express.Router();

let cached = 0;

router.get('/', (req, res) => {
  return res.json({ cached });
});

router.post('/*', async (req, res) => {
  let url = req.params[0];
  url = url.startsWith('http') ? url : `https://${url}`;

  const { query } = req.body;
  const obj = parse(query);
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

  const result = await graphqlQuery(url, str);

  if (caching) {
    set(key, result).then(() => console.log('Cache stored', { key }));
  }

  return res.json(result);
});

export default router;

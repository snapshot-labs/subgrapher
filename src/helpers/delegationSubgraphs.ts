const SUBGRAPH_KEY = process.env.SUBGRAPH_KEY;
// Create one from https://thegraph.com/studio/apikeys

export default {
  '1': `https://gateway-arbitrum.network.thegraph.com/api/${SUBGRAPH_KEY}/subgraphs/id/4YgtogVaqoM8CErHWDK8mKQ825BcVdKB8vBYmb4avAQo`,
  '5': 'https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot-goerli',
  '10': 'https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot-optimism',
  '56': 'https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot-binance-smart-chain',
  '100': 'https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot-gnosis-chain',
  '137': 'https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot-polygon',
  '250': 'https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot-fantom',
  '42161': 'https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot-arbitrum',
  '11155111': `https://gateway-arbitrum.network.thegraph.com/api/${SUBGRAPH_KEY}/subgraphs/id/2SZVRR6G8txMFtf39aw2aP7BTAawRVwgqHeQXMhr7BRJ`
};

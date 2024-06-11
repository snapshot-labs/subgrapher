const SUBGRAPH_KEY = process.env.NON_RESTRICTED_SUBGRAPH_KEY;
// Create one from https://thegraph.com/studio/apikeys without any restrictions

export default {
  mainnet: `https://gateway.network.thegraph.com/api/${SUBGRAPH_KEY}/subgraphs/id/`,
  arbitrum: `https://gateway-arbitrum.network.thegraph.com/api/${SUBGRAPH_KEY}/subgraphs/id/`
};

import { buildURL } from '../../src/utils';

describe('buildURL general use case', () => {
  it('if a URL is passed, return error', () => {
    expect(() => buildURL('http://localhost:3000')).toThrowError('Invalid subgraph');
  });
});

describe('buildURL delegation cases', () => {
  it('if an invalid network is passed, return error', () => {
    expect(() => buildURL('delegation/2')).toThrowError('Invalid network');
  });
  it('if no network is passed, return error', () => {
    expect(() => buildURL('delegation/')).toThrowError('Invalid network');
  });
  it('if a delegation subgraph URL is passed, return the subgraph URL', () => {
    expect(buildURL('delegation/1')).toBe(
      `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_KEY}/subgraphs/id/4YgtogVaqoM8CErHWDK8mKQ825BcVdKB8vBYmb4avAQo`
    );
    expect(buildURL('delegation/10')).toBe(
      `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_KEY}/subgraphs/id/CAsVTyvLA6vnvDX9zgXifmi3wFM8GYeNHvRpxsABvbYL`
    );
  });
  it('if an extra slash is passed, should still return subgraph URL', () => {
    expect(buildURL('delegation/1/')).toBe(
      `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_KEY}/subgraphs/id/4YgtogVaqoM8CErHWDK8mKQ825BcVdKB8vBYmb4avAQo`
    );
  });
});

describe('buildURL upgraded subgraph cases', () => {
  it('if an invalid network is passed, return error', () => {
    expect(() => buildURL('subgraph/2')).toThrowError('Invalid network');
  });
  it('if no network is passed, return error', () => {
    expect(() => buildURL('subgraph/')).toThrowError('Invalid network');
  });
  it('if an invalid subgraph is passed, return error', () => {
    expect(() => buildURL('subgraph/arbitrum')).toThrowError('Invalid subgraph');
  });
  it('if no subgraph is passed, return error', () => {
    expect(() => buildURL('subgraph/arbitrum/')).toThrowError('Invalid subgraph');
  });
  it('if a upgraded snapshot subgraph URL is passed, return the subgraph URL', () => {
    expect(buildURL('subgraph/arbitrum/EYCKATKGBKLWvSfwvBjzfCBmGwYNdVkduYXVivCsLRFu')).toBe(
      `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NON_RESTRICTED_SUBGRAPH_KEY}/subgraphs/id/EYCKATKGBKLWvSfwvBjzfCBmGwYNdVkduYXVivCsLRFu`
    );
  });
  it('if a different upgraded snapshot subgraph URL is passed, return the subgraph URL', () => {
    expect(buildURL('subgraph/mainnet/2XuuZyGrxw72keXKfeHQW7yaGqVa7dyoghkgdGMdC6Az')).toBe(
      `https://gateway.network.thegraph.com/api/${process.env.NON_RESTRICTED_SUBGRAPH_KEY}/subgraphs/id/2XuuZyGrxw72keXKfeHQW7yaGqVa7dyoghkgdGMdC6Az`
    );
  });
  it('if an extra slash is passed, should still return subgraph URL', () => {
    expect(buildURL('subgraph/arbitrum/EYCKATKGBKLWvSfwvBjzfCBmGwYNdVkduYXVivCsLRFu/')).toBe(
      `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NON_RESTRICTED_SUBGRAPH_KEY}/subgraphs/id/EYCKATKGBKLWvSfwvBjzfCBmGwYNdVkduYXVivCsLRFu`
    );
  });
});



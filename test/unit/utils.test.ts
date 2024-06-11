import { buildURL } from '../../src/utils';

describe('buildURL general use case', () => {
  it('returns error if a URL is passed', () => {
    expect(() => buildURL('http://localhost:3000')).toThrowError('Invalid subgraph');
  });
});

describe('buildURL delegation cases', () => {
  it('returns error if an invalid network is passed', () => {
    expect(() => buildURL('delegation/2')).toThrowError('Invalid network');
  });
  it('returns error if no network is passed', () => {
    expect(() => buildURL('delegation/')).toThrowError('Invalid network');
  });
  it('returns the subgraph URL if a delegation subgraph URL is passed', () => {
    expect(buildURL('delegation/1')).toBe(
      `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_KEY}/subgraphs/id/4YgtogVaqoM8CErHWDK8mKQ825BcVdKB8vBYmb4avAQo`
    );
    expect(buildURL('delegation/10')).toBe(
      `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_KEY}/subgraphs/id/CAsVTyvLA6vnvDX9zgXifmi3wFM8GYeNHvRpxsABvbYL`
    );
  });
  it('should still return subgraph URL if an extra slash is passed', () => {
    expect(buildURL('delegation/1/')).toBe(
      `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_KEY}/subgraphs/id/4YgtogVaqoM8CErHWDK8mKQ825BcVdKB8vBYmb4avAQo`
    );
  });
});

describe('buildURL upgraded subgraph cases', () => {
  it('returns error if an invalid network is passed', () => {
    expect(() => buildURL('subgraph/2')).toThrowError('Invalid network');
  });
  it('returns error if no network is passed', () => {
    expect(() => buildURL('subgraph/')).toThrowError('Invalid network');
  });
  it('returns error if an invalid subgraph is passed', () => {
    expect(() => buildURL('subgraph/arbitrum')).toThrowError('Invalid subgraph');
  });
  it('returns error if no subgraph is passed', () => {
    expect(() => buildURL('subgraph/arbitrum/')).toThrowError('Invalid subgraph');
  });
  it('returns the subgraph URL if a upgraded snapshot subgraph URL is passed', () => {
    expect(buildURL('subgraph/arbitrum/EYCKATKGBKLWvSfwvBjzfCBmGwYNdVkduYXVivCsLRFu')).toBe(
      `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NON_RESTRICTED_SUBGRAPH_KEY}/subgraphs/id/EYCKATKGBKLWvSfwvBjzfCBmGwYNdVkduYXVivCsLRFu`
    );
  });
  it('returns the subgraph URL if a different upgraded snapshot subgraph URL is passed', () => {
    expect(buildURL('subgraph/mainnet/2XuuZyGrxw72keXKfeHQW7yaGqVa7dyoghkgdGMdC6Az')).toBe(
      `https://gateway.network.thegraph.com/api/${process.env.NON_RESTRICTED_SUBGRAPH_KEY}/subgraphs/id/2XuuZyGrxw72keXKfeHQW7yaGqVa7dyoghkgdGMdC6Az`
    );
  });
  it('should still return subgraph URL if an extra slash is passed', () => {
    expect(buildURL('subgraph/arbitrum/EYCKATKGBKLWvSfwvBjzfCBmGwYNdVkduYXVivCsLRFu/')).toBe(
      `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NON_RESTRICTED_SUBGRAPH_KEY}/subgraphs/id/EYCKATKGBKLWvSfwvBjzfCBmGwYNdVkduYXVivCsLRFu`
    );
  });
});

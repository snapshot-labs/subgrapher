import request from 'supertest';

const HOST = `http://localhost:${process.env.PORT || 3003}`;
const PROXIED_URL =
  '/subgrapher.snapshot.org/api.thegraph.com/subgraphs/name/snapshot-labs/snapshot-arbitrum';

describe('api', () => {
  describe('send a request to the proxied service', () => {
    const payload = {
      query:
        'query { delegations (where: {space_in: ["", "stgdao.eth", "stgdao"]}, first: 1, skip: 1) { delegator space delegate } }'
    };

    describe('on success', () => {
      it('should return a 200', async () => {
        const response = await request(HOST).post(PROXIED_URL).send(payload);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          data: {
            delegations: [
              {
                delegator: '0x00000e36688330d643e7a7f25440320049a6c210',
                space: '',
                delegate: '0x9abcaeae8ac01136740f83cb52bee3c8106c108f'
              }
            ]
          }
        });
      });
    });

    describe('on error', () => {
      it('should return a 400 on malformed query', async () => {
        const response = await request(HOST).post(PROXIED_URL);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          errors: [{ message: 'No query provided' }]
        });
      });

      it('should return a 400 on missing url', async () => {
        const response = await request(HOST).post('/');

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          errors: [{ message: 'No subgraph URL provided' }]
        });
      });

      it('should return a 400 on invalid query', async () => {
        const response = await request(HOST).post('/gateway-test').send({ query: 'sdkfksdf' });

        expect(response.statusCode).toBe(400);
        expect(response.body.errors[0].message).toContain('Query parse error');
      });

      it('should return a 500 on invalid proxied url', async () => {
        const response = await request(HOST).post('/gateway-test').send(payload);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
          errors: [
            {
              message:
                'request to https://gateway-test failed, reason: getaddrinfo ENOTFOUND gateway-test'
            }
          ]
        });
      });

      it('should return a 500 on network error to proxied url', async () => {
        const response = await request(HOST).post('/snapshot.org').send(payload);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
          errors: [
            {
              message: 'Unable to connect to https://snapshot.org, code: 405'
            }
          ]
        });
      });

      it('should return a 400 on graphql error', async () => {
        const response = await request(HOST).post(PROXIED_URL).send({
          query:
            'query { delegations (where: {space_in: ["", "stgdao.eth", "stgdao"]}, first: 1, skip: 1000000000) { delegator space delegate } }'
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          errors: [
            { message: expect.stringContaining('The `skip` argument must be between 0 and') }
          ]
        });
      });
    });
  });
});

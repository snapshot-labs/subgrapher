import request from 'supertest';

const HOST = `http://localhost:${process.env.PORT || 3003}`;

describe('api', () => {
  describe('send a request to the proxied service', () => {
    const payload = {
      query:
        'query { delegations (where: {space_in: ["", "stgdao.eth", "stgdao"]}, first: 1, skip: 1) { delegator space delegate } }'
    };

    describe('on success', () => {
      it('should return a 200', async () => {
        const response = await request(HOST)
          .post(
            '/gateway-arbitrum.network.thegraph.com/api/0f15b42bdeff7a063a4e1757d7e2f99e/subgraphs/id/4YgtogVaqoM8CErHWDK8mKQ825BcVdKB8vBYmb4avAQo'
          )
          .send(payload);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          data: {
            delegations: [
              {
                delegator: '0x00015f4a9b778a81cde7a9e6330bf0e2b46a882b',
                space: '',
                delegate: '0x59ee84e74662e824e44835322bf6078f4f93dd37'
              }
            ]
          }
        });
      });
    });

    describe('on error', () => {
      it('should return a 400 on malformed query', async () => {
        const response = await request(HOST).post(
          '/gateway-arbitrum.network.thegraph.com/api/0f15b42bdeff7a063a4e1757d7e2f99e/subgraphs/id/4YgtogVaqoM8CErHWDK8mKQ825BcVdKB8vBYmb4avAQo'
        );

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
          errors: [{ message: 'No query provided' }]
        });
      });

      it('should return a 500 on invalid query', async () => {
        const response = await request(HOST).post('/gateway-test').send({ query: 'sdkfksdf' });

        expect(response.statusCode).toBe(500);
        expect(response.body.errors[0].message).toContain('Query parse error');
      });

      it('should return a 500 on invalid proxied url', async () => {
        const response = await request(HOST).post('/gateway-test').send(payload);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
          errors: [{ message: 'Unknown error' }]
        });
      });
    });
  });
});

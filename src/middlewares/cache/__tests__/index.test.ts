import checkCache from '../index';
import redis from '../../../db/redis/index';

const mockedReq: Record<string, any> =
  ({ query: { timestmap: '2022-09-12' }, params: { id: 1 } });
const mockedRes: Record<string, any> =
  ({ status: jest.fn().mockReturnValue({}), json: jest.fn().mockReturnValue({}) });
const mockedNext = jest.fn();

describe('CheckCache middleware', () => {
  beforeAll(() => {
    jest.spyOn(redis, 'getTimeSeries').mockImplementation(async () =>
      [{ timestamp: 34245435, value: 0 }]);
  });
  it('Should not get car info from redis cache', async () => {
    // @ts-expect-error
    jest.spyOn(redis, 'getHash').mockImplementationOnce(async () => ([]));

    // @ts-expect-error
    await checkCache(mockedReq, mockedRes, mockedNext);

    expect(mockedNext).toHaveBeenCalledTimes(1);
  });

  it('Should get car info from redis cache', async () => {
    jest.spyOn(redis, 'getHash').mockImplementationOnce(async () =>
      ({ id: 1, make: 'BMW', model: 'X1' }));

    // @ts-expect-error
    await checkCache(mockedReq, mockedRes, mockedNext);

    expect(mockedRes.status).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});

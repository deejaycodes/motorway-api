import dayjs from 'dayjs';

import { getVehicleByParams } from '../vehicle';
import { VehicleStates } from '../../@types';
import db, { connectDb, disConnectDb } from '../../db/postgres';
import redis from '../../db/redis';

let updateCacheMock: jest.SpyInstance;

beforeAll(async () => {
  await connectDb();
  updateCacheMock = jest.spyOn(redis, 'updateCacheStorage').mockImplementation(async () => {});
});

describe('Vehicle controller', () => {
  it('Should return vehicle info based on timestamp and vehicleId', async () => {
    const vehicle = await getVehicleByParams('1', '2022-09-12 19:03:54+02:00');

    expect(vehicle).toEqual({
      id: 1,
      make: 'BMW',
      model: 'X1',
      state: VehicleStates.QUOTED,
    });
  });

  it('Should return vehicle info with state current state as date is after current date', async () => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    jest.spyOn(db, 'query').mockImplementationOnce(async (): Promise<any> => ({
      rows: [{
        id: 1,
        make: 'BMW',
        model: 'X1',
        pastState: VehicleStates.QUOTED,
        currentState: VehicleStates.SOLD,
        timestamp: dayjs('2022-12-12 19:03:54+02:00'),
      }]
    }));

    const vehicle = await getVehicleByParams('1', dayjs().add(1, 'day').format());

    expect(vehicle).toEqual({
      id: 1,
      make: 'BMW',
      model: 'X1',
      state: VehicleStates.SOLD,
    });
  });

  it('Should update the cache', async () => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    jest.spyOn(db, 'query').mockImplementationOnce(async (): Promise<any> => ({
      rows: [{
        id: 1,
        make: 'BMW',
        model: 'X1',
        pastState: VehicleStates.QUOTED,
        currentState: VehicleStates.SOLD,
        timestamp: dayjs('2022-12-12 19:03:54+02:00'),
      }]
    }));

    const vehicle = await getVehicleByParams('1', '2022-12-12 19:03:54+02:00');

    expect(vehicle).toEqual({
      id: 1,
      make: 'BMW',
      model: 'X1',
      state: VehicleStates.SOLD,
    });

    expect(updateCacheMock).toBeCalledTimes(1);
  });
});

afterAll(async () => {
  await disConnectDb();
});

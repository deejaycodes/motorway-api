import query from '../../vehicles/getVehiclesWithStateByIdAndTimeStamp';
import db, { connectDb, disConnectDb } from '../../../index';
import dayjs from 'dayjs';

describe('Vehicle queries', () => {
  beforeAll(async () => {
    await connectDb();
  });

  it('Should return vehicle details with statLogs data', async () => {
    const res = await db.query(query, [1, dayjs()]);

    expect(res.rows[0]).toEqual({
      currentState: 'quoted',
      id: 1,
      make: 'BMW',
      model: 'X1',
      pastState: 'quoted',
      timestamp: dayjs('2022-09-10T10:23:54.000Z').toDate()
    });
  });

  afterAll(async () => {
    await disConnectDb();
  });
});

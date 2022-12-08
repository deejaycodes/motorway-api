import { createClient } from 'redis';
import { TimeSeriesDuplicatePolicies, TimeSeriesEncoding } from '@redis/time-series';

import { TimeSeriesValue, VehicleBase } from '../../@types';
import logger from '../../utils/logger';
import { timeSeriesPrefix } from '../../utils/constants';
import config from '../../config';

const { redisDb: { url } } = config;

const client = createClient({ url });

/**
 * Returns created redis client
 * @returns {Object}
 */
export const redisClient = client;

/**
 * Insert into redis time series
 * @param key : string
 * @param tsTime : number
 * @param state : number
 * @returns {Promise<void>}
 */
const checkAndAddTS = async (key: string, tsTime: number, state: number): Promise<void> => {
  try {
    // Get info about time series(check if exists)
    await client.ts.info(`${timeSeriesPrefix}${key}`);
  } catch (e) {
    // If no time series key create it
    await client.ts.create(`${timeSeriesPrefix}${key}`, {
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED, // No compression
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK // No duplicates
    });
  }

  try {
    // Add state into time series
    await client.ts.add(`${timeSeriesPrefix}${key}`, tsTime, state);
  } catch (e) {
    logger.error('Error during adding timestamp: ', e);
  }
};

/**
 * Returns redis time series details
 * @param key : string
 * @param fromTimestamp : date
 * @param toTimestamp : date
 * @returns {Promise<Object>}
 */
export const getTimeSeries = (key: string, fromTimestamp: Date, toTimestamp: Date): Promise<TimeSeriesValue[]> => {
  const fromMS = fromTimestamp.getTime();
  const toMS = toTimestamp.getTime();

  return client.ts.range(`${timeSeriesPrefix}${key}`, fromMS, toMS, {
    // Select only first item
    COUNT: 1
  });
};

/**
 * Insert value into redis Hash
 * @param key : string
 * @param vehicle : Object
 * @returns {Promise<number>}
 */
export const addHash = (key: string, vehicle: VehicleBase): Promise<number> => client.hSet(key, {
  ...vehicle
});

/**
 * Returns redis hash
 * @param key : string
 * @returns {Promise<Object>}
 */
export const getHash = (key: string): Promise<VehicleBase> =>
  client.hGetAll(key) as unknown as Promise<VehicleBase>;

/**
 * Insert into redis hash and time series
 * @param key : string
 * @param timestamp : date
 * @param state : number
 * @param vehicle : Object
 * @returns {Promise<void>}
 */
export const updateCacheStorage =
  async (key: string, timestamp: Date, state: number, vehicle: VehicleBase): Promise<void> => {
    const tsTime = timestamp.getTime();
    try {
      const vehicle = await client.hGetAll(key) as unknown as VehicleBase;

      // If HashSet does not exist, create it
      if (Object.keys(vehicle).length === 0) {
        await addHash(key, vehicle);
      }

      await checkAndAddTS(key, tsTime, state);
    } catch {
      try {
        // Triggered for example when time series does not exist
        await addHash(key, vehicle);
        await checkAndAddTS(key, tsTime, state);
      } catch (e) {
        logger.error('Error during cache create: ', e);
      }
    }
  };

export default {
  checkAndAddTS,
  getTimeSeries,
  addHash,
  getHash,
  updateCacheStorage
};

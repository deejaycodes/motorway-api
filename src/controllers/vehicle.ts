import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';

import logger from '../utils/logger';
import db from '../db/postgreSQL';
import getVehiclesWithStateByIdAndTimeStamp from '../db/postgreSQL/sql/vehicles/getVehiclesWithStateByIdAndTimeStamp';
import { ErrorCodes, Vehicle, VehicleWithStateLog } from '../@types';
import redis from '../db/redis';

import { STATES_MAP } from '../utils/constants';
import HttpException from '../exceptions/HttpException';

dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

/**
 * Returns vehicle details by id and timestamp
 * @param vehicleId : string
 * @param timestamp : string
 * @returns {Promise<Object>}
 */
export async function getVehicleByParams (vehicleId: string, timestamp: string): Promise<Vehicle> {
  const date = dayjs(timestamp);
  const start = date.subtract(1, 'minute');
  const end = date.add(1, 'minute');

  const vehicleState = await db.query(getVehiclesWithStateByIdAndTimeStamp, [vehicleId, end]);
  const vehicle: VehicleWithStateLog = vehicleState.rows[0];

  if (!vehicle) {
    throw new HttpException(404, ErrorCodes.NOT_FOUND, 'Vehicle history not found for provided timestamp');
  }

  let stateToReturn = vehicle.pastState;

  if (dayjs(vehicle.timestamp).isBetween(start, end)) {
    // Saves to cache only for match for +-1 minute range as i dont know exact moment of updating historical table
    redis.updateCacheStorage(
      vehicle.id.toString(),
      date.toDate(),
      STATES_MAP[stateToReturn],
      { id: vehicle.id, make: vehicle.make, model: vehicle.model }).catch((e) => logger.error(e));
  }

  if (date.isSameOrAfter(dayjs())) {
    // For future dates return currentState from vehicles table
    stateToReturn = vehicle.currentState;
  }

  return { id: vehicle.id, make: vehicle.make, model: vehicle.model, state: stateToReturn };
}

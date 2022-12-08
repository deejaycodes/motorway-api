import { NextFunction, Request, Response } from 'express';
import dayjs from 'dayjs';

import redis from '../../db/redis';
import {
  vehicleQueryParams,
  VehicleBase, TimeSeriesValue, vehiclePathParams
} from '../../@types';
import { STATES_MAP } from '../../utils/constants';
import logger from '../../utils/logger';

/** Check redis to fetch cached value if exists
  * @param req : Express request with timestamp and id
  * @param res : Express response
  * @param next : Express Next handler
  * @returns next|res
*/
export default function (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { timestamp } = req.query as unknown as vehicleQueryParams;
  const { id } = req.params as unknown as vehiclePathParams;

  const date = dayjs(timestamp);
  const start = date.subtract(1, 'minute');
  const end = date.add(1, 'minute');

  return redis.getTimeSeries(id, start.toDate(), end.toDate()).then((timeSeries: TimeSeriesValue[]) => {
    if (timeSeries[0]) {
      return redis.getHash(id).then((vehicle: VehicleBase) => {
        if (Object.keys(vehicle).length !== 0) {
          logger.error('Content served from Redis cache');

          res.status(200).json({
            ...vehicle,
            id: Number(vehicle.id),
            // @ts-expect-error
            state: STATES_MAP[timeSeries[0].value]
          });

          return;
        }

        next();
      }).catch(() => {
        logger.error('Can not get cache, fetching from PG');
        next();
      });
    }

    next();
  }).catch(() => {
    logger.error('Can not get cache, fetching from PG');
    next();
  });
}

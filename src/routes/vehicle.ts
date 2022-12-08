import { NextFunction, Request, Response, Router } from 'express';

import { vehicleQueryParams, vehiclePathParams } from '../@types';

import validate from '../middlewares/validators';
import { get } from '../middlewares/validators/vehicles';
import checkCache from '../middlewares/cache';

import { getVehicleByParams } from '../controllers/vehicle';

const router = Router();

router.get(
  '/:id',
  [...get, validate],
  checkCache,
  (req: Request, res: Response, next: NextFunction) => {
    const { timestamp } = req.query as unknown as vehicleQueryParams;
    const { id } = req.params as unknown as vehiclePathParams;

    getVehicleByParams(id, timestamp)
      .then((data) => res.status(200).json(data))
      .catch((e) => next(e));
  },
);

export default router;

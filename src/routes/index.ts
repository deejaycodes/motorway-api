import { Application } from 'express';

import vehicleRouter from './vehicle';

/** Mounts vehicle routes into app
 * @param app : Express App
 * @returns void
 */
export default function (app: Application): void {
  app.use('/vehicle', vehicleRouter);
};

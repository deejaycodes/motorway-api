import express, { Application, NextFunction, Request, Response } from 'express';

import config from './config';
import logger from './utils/logger';
import mountRouter from './routes';

const { env } = config;

const app: Application = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  env === 'development' &&
  logger.info(
    `M: ${req.method} B: ${JSON.stringify(req.body)} Q: ${JSON.stringify(req.query)}`
  );

  next();
});

mountRouter(app);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (!isNaN(err?.status)) {
    return res.status(err.status).json({ message: err.message, code: err.code });
  }

  logger.error('Unexpected error: ', err);

  return res.status(500).send(err.toString());
});

export default app;

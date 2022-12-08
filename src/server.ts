import app from './app';
import { connectDb } from './db/postgreSQL';
import logger from './utils/logger';
import { redisClient } from './db/redis';
import config from './config';

const { port } = config;

connectDb()
  .then(() => {
    logger.info('PostgreSQL connection initialized');

    redisClient.connect().then(() => {
      logger.info('Redis connection initialized');

      app.listen(port, () => logger.info(`Server is listening on port ${port}!`));
    }).catch((err) => logger.error('Redis connection error: ', err));
  })
  .catch((err) => {
    logger.error('PostgreSQL connection error: ', err);
  });

import dotenv from 'dotenv';

dotenv.config();

export default {
  env: process.env.NODE_ENV ?? 'development',
  logDir: process.env.LOG_DIR ?? 'log',
  pgDb: {
    url: process.env.PG_URL ?? 'postgres://user:password@localhost:5432/motorway-v1',
  },
  redisDb: {
    url: process.env.REDIS_URL ?? 'redis://localhost'
  },
  port: process.env.PORT ?? '5000'
};

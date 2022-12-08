import { Client } from 'pg';

import config from '../../config';

const { pgDb: { url } } = config;

const db = new Client(url);

/**
 * Connect to Db
 * @returns {Promise<void>}
 */
export const connectDb = (): Promise<void> => db.connect();

/**
 * Disconnect Db
 * @returns {Promise<void>}
 */
export const disConnectDb = (): Promise<void> => db.end();

export default db;

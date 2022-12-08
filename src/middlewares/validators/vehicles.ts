import { query } from 'express-validator';

import { ErrorCodes } from '../../@types';

export const get = [
  query('timestamp')
    .notEmpty()
    .withMessage({ status: 400, code: ErrorCodes.MISSING_PARAM, message: 'timestamp is required' })
    .isISO8601().toDate()
    .withMessage({ status: 422, code: ErrorCodes.PARAM_NOT_VALID, message: 'Enter a valid timestamp' })
];

import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import HttpException from '../../exceptions/HttpException';
import { genericError } from '../../@types';

/** Checks validation errors
 * @param req : Express request with timestamp and id
 * @param res : Express response
 * @param next : Express Next handler
 * @returns next
 */
export default function (req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstErrors = errors.array({ onlyFirstError: true });
    const { msg }: { msg: genericError } = firstErrors[0];

    return next(new HttpException(msg.status, msg.code, msg.message));
  }

  return next();
};

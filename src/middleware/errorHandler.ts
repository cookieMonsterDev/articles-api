import { Request, Response, NextFunction } from 'express';
import HttpErrors from './httpErrors';

const errorHandler = (
  err: HttpErrors,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const messsage = err.message || 'Something went wrong';
  const reason = err.reason?.replace(`Error: `, '') || 'unknown';
  const stack = err.stack?.replace(`Error: `, '');

  res.status(status).json({
    status: status,
    messsage: messsage,
    reason: reason,
    stack: stack,
  });
};

export default errorHandler;

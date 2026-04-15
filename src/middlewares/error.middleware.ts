import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import config from '../config';

export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, message } = err;

  if (config.env === 'test') {
    console.error(`[Test Error]: ${statusCode} - ${message}`, err.stack);
  }

  const response = {
    success: false,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).send(response);
};

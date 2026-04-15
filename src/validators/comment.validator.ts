import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

export const validateComment = (req: Request, res: Response, next: NextFunction) => {
  const { content, post } = req.body;

  if (!content || !post) {
    return next(new ApiError(400, 'Content and post ID are required'));
  }

  if (content.length > 500) {
    return next(new ApiError(400, 'Comment cannot be more than 500 characters'));
  }

  next();
};

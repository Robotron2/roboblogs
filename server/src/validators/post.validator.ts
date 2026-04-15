import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

export const validatePost = (req: Request, res: Response, next: NextFunction) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return next(new ApiError(400, 'Title and content are required'));
  }

  if (title.length > 100) {
    return next(new ApiError(400, 'Title cannot be more than 100 characters'));
  }

  next();
};

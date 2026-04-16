import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import config from '../config';
import ApiError from '../utils/ApiError';
import { User } from '../models/user.model';
import catchAsync from '../utils/catchAsync';

import { IUser } from '../types/user.types';

export interface AuthRequest extends Request {
  user?: IUser | null;
}

export const optionalProtect = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token, config.jwt.accessSecret);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    // If token is invalid, just proceed without user
    next();
  }
});

export const protect = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized to access this route');
  }

  try {
    const decoded = verifyToken(token, config.jwt.accessSecret);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      throw new ApiError(401, 'The user belonging to this token no longer exists');
    }
    
    next();
  } catch (error) {
    throw new ApiError(401, 'Not authorized to access this route');
  }
});

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action');
    }
    next();
  };
};

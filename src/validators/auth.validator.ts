import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ApiError(400, 'All fields are required'));
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return next(new ApiError(400, 'Invalid email format'));
  }

  if (password.length < 6) {
    return next(new ApiError(400, 'Password must be at least 6 characters long'));
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, 'Email and password are required'));
  }

  next();
};

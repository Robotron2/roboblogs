import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import catchAsync from '../utils/catchAsync';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';
import config from '../config';

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body as any);
  const { accessToken, refreshToken } = authService.generateAuthTokens(user);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json(new ApiResponse(true, 'User registered successfully', { user, accessToken }));
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUser(email, password);
  const { accessToken, refreshToken } = authService.generateAuthTokens(user);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json(new ApiResponse(true, 'Login successful', { user, accessToken }));
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json(new ApiResponse(true, 'Logged out successfully', null));
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = (req as any).cookies?.refreshToken as string | undefined;
  if (!refreshToken) {
    throw new ApiError(401, 'No refresh token provided');
  }
  const accessToken = await authService.refreshAccessToken(refreshToken);

  res.status(200).json(new ApiResponse(true, 'Token refreshed successfully', { accessToken }));
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email);
  res.status(200).json(new ApiResponse(true, 'Password reset email sent', null));
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.params.token as string, req.body.password);
  res.status(200).json(new ApiResponse(true, 'Password reset successful', null));
});

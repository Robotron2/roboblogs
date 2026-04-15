import { Response } from 'express';
import * as likeService from '../services/like.service';
import catchAsync from '../utils/catchAsync';
import ApiResponse from '../utils/ApiResponse';
import { AuthRequest } from '../middlewares/auth.middleware';
import ApiError from '../utils/ApiError';

export const likePost = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, 'User not found');
  if (!req.params.postId) throw new ApiError(400, 'Post ID is required');
  await likeService.likePost(req.params.postId as string, req.user._id);
  res.status(201).json(new ApiResponse(true, 'Post liked successfully', null));
});

export const unlikePost = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, 'User not found');
  if (!req.params.postId) throw new ApiError(400, 'Post ID is required');
  await likeService.unlikePost(req.params.postId as string, req.user._id);
  res.status(200).json(new ApiResponse(true, 'Post unliked successfully', null));
});

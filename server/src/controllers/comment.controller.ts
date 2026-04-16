import { Request, Response } from 'express';
import * as commentService from '../services/comment.service';
import catchAsync from '../utils/catchAsync';
import ApiResponse from '../utils/ApiResponse';
import { AuthRequest } from '../middlewares/auth.middleware';
import ApiError from '../utils/ApiError';

export const addComment = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, 'User not found');
  const commentData = { ...req.body, user: req.user._id };
  const comment = await commentService.addComment(commentData);
  res.status(201).json(new ApiResponse(true, 'Comment added successfully', comment));
});

export const getComments = catchAsync(async (req: Request, res: Response) => {
  if (!req.params.postId) throw new ApiError(400, 'Post ID is required');
  const result = await commentService.getPostComments(req.params.postId as string, req.query);
  res.status(200).json(new ApiResponse(true, 'Comments retrieved successfully', result));
});

export const getGlobalComments = catchAsync(async (req: Request, res: Response) => {
  const result = await commentService.getAllComments(req.query);
  res.status(200).json(new ApiResponse(true, 'Global comments retrieved successfully', result));
});

export const deleteComment = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, 'User not found');
  if (!req.params.id) throw new ApiError(400, 'Comment ID is required');
  await commentService.deleteComment(req.params.id as string, req.user._id, req.user.role);
  res.status(200).json(new ApiResponse(true, 'Comment deleted successfully', null));
});

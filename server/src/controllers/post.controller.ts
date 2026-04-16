import { Request, Response } from 'express';
import * as postService from '../services/post.service';
import catchAsync from '../utils/catchAsync';
import ApiResponse from '../utils/ApiResponse';
import { AuthRequest } from '../middlewares/auth.middleware';
import ApiError from '../utils/ApiError';

export const createPost = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, 'User not found');
  const postData = { ...req.body, author: req.user._id };
  const post = await postService.createPost(postData);
  res.status(201).json(new ApiResponse(true, 'Post created successfully', post));
});

export const updatePost = catchAsync(async (req: Request, res: Response) => {
  if (!req.params.id) throw new ApiError(400, 'Post ID is required');
  const post = await postService.updatePost(req.params.id as string, req.body);
  res.status(200).json(new ApiResponse(true, 'Post updated successfully', post));
});

export const deletePost = catchAsync(async (req: Request, res: Response) => {
  if (!req.params.id) throw new ApiError(400, 'Post ID is required');
  await postService.deletePost(req.params.id as string);
  res.status(200).json(new ApiResponse(true, 'Post deleted successfully', null));
});

export const getPosts = catchAsync(async (req: AuthRequest, res: Response) => {
  const isAdmin = req.user?.role === 'admin';
  const result = await postService.getAllPosts(req.query, req.user?._id, isAdmin);
  res.status(200).json(new ApiResponse(true, 'Posts retrieved successfully', result));
});

export const getPost = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.params.slug) throw new ApiError(400, 'Post slug is required');
  const isAdmin = req.user?.role === 'admin';
  const post = await postService.getPostBySlug(req.params.slug as string, req.user?._id, isAdmin, req.ip);
  res.status(200).json(new ApiResponse(true, 'Post retrieved successfully', post));
});

export const unpublishPost = catchAsync(async (req: Request, res: Response) => {
  if (!req.params.id) throw new ApiError(400, 'Post ID is required');
  const post = await postService.unpublishPost(req.params.id as string);
  res.status(200).json(new ApiResponse(true, 'Post unpublished successfully', post));
});

export const publishPost = catchAsync(async (req: Request, res: Response) => {
  if (!req.params.id) throw new ApiError(400, 'Post ID is required');
  const post = await postService.publishPost(req.params.id as string);
  res.status(200).json(new ApiResponse(true, 'Post published successfully', post));
});

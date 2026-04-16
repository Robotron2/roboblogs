import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';
import catchAsync from '../utils/catchAsync';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) throw new ApiError(400, 'Name is required');
  const category = await categoryService.createCategory(name);
  res.status(201).json(new ApiResponse(true, 'Category created successfully', category));
});

export const getCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json(new ApiResponse(true, 'Categories retrieved successfully', categories));
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!id) throw new ApiError(400, 'Category ID is required');
  if (!name) throw new ApiError(400, 'Name is required');
  const category = await categoryService.updateCategory(id as string, name);
  res.status(200).json(new ApiResponse(true, 'Category updated successfully', category));
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new ApiError(400, 'Category ID is required');
  await categoryService.deleteCategory(id as string);
  res.status(200).json(new ApiResponse(true, 'Category deleted successfully', null));
});

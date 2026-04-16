import { Category, ICategory } from '../models/category.model';
import ApiError from '../utils/ApiError';

export const createCategory = async (name: string) => {
  const existing = await Category.findOne({ name });
  if (existing) {
    throw new ApiError(400, 'Category already exists');
  }
  const category = await Category.create({ name });
  return category;
};

export const getAllCategories = async () => {
  return await Category.find().sort({ name: 1 });
};

export const updateCategory = async (id: string, name: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  category.name = name;
  await category.save();
  return category;
};

export const deleteCategory = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  await category.deleteOne();
};

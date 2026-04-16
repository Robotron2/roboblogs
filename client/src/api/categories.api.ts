import api from './axios';
import type { ApiResponse, Category } from '../types';

export const categoriesApi = {
  getAll: () =>
    api.get<ApiResponse<Category[]>>('/categories'),

  create: (name: string) =>
    api.post<ApiResponse<Category>>('/categories', { name }),

  update: (id: string, name: string) =>
    api.put<ApiResponse<Category>>(`/categories/${id}`, { name }),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/categories/${id}`),
};

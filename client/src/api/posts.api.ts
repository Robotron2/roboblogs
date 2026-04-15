import api from './axios';
import type { ApiResponse, Post, PaginatedResponse } from '../types';

interface CreatePostData {
  title: string;
  content: string;
  coverImage?: string;
}

export const postsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<ApiResponse<PaginatedResponse<Post>>>('/posts', { params }),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<Post>>(`/posts/${slug}`),

  create: (data: CreatePostData) =>
    api.post<ApiResponse<Post>>('/posts', data),

  update: (id: string, data: Partial<CreatePostData>) =>
    api.put<ApiResponse<Post>>(`/posts/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/posts/${id}`),
};

import api from './axios';
import type { ApiResponse, Comment, CommentPaginatedResponse } from '../types';

export const commentsApi = {
  getByPost: (postId: string, params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse<Comment[]>>(`/comments/${postId}`, { params }),

  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse<CommentPaginatedResponse>>('/comments/all', { params }),

  create: (data: { post: string; content: string }) =>
    api.post<ApiResponse<Comment>>('/comments', data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/comments/${id}`),
};

import api from './axios';
import type { ApiResponse, Comment } from '../types';

export const commentsApi = {
  getByPost: (postId: string, params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse<Comment[]>>(`/comments/${postId}`, { params }),

  create: (data: { post: string; content: string }) =>
    api.post<ApiResponse<Comment>>('/comments', data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/comments/${id}`),
};

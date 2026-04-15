import api from './axios';
import type { ApiResponse, Like } from '../types';

export const likesApi = {
  like: (postId: string) =>
    api.post<ApiResponse<Like>>(`/likes/${postId}/like`),

  unlike: (postId: string) =>
    api.delete<ApiResponse<null>>(`/likes/${postId}/unlike`),
};

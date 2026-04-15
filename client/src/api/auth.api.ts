import api from './axios';
import type { ApiResponse, User } from '../types';

interface AuthData {
  user: User;
  accessToken: string;
}

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<AuthData>>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthData>>('/auth/login', data),

  logout: () =>
    api.post<ApiResponse<null>>('/auth/logout'),

  refreshToken: () =>
    api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh'),

  forgotPassword: (email: string) =>
    api.post<ApiResponse<null>>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.put<ApiResponse<null>>(`/auth/reset-password/${token}`, { password }),
};

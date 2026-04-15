import api from './axios';
import type { ApiResponse, User } from '../types';

export const usersApi = {
  getMe: () =>
    api.get<ApiResponse<User>>('/users/me'),
};

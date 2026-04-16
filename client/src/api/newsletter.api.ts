import api from './axios';

export const newsletterApi = {
  subscribe: (email: string) => 
    api.post<{ success: boolean; message: string; data: any }>('/newsletter/subscribe', { email }),
    
  unsubscribe: (token: string) => 
    api.post<{ success: boolean; message: string; data: any }>(`/newsletter/unsubscribe/${token}`),
};

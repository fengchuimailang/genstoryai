import { apiClient } from './api-client';

export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string; // 可以是邮箱或用户名
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface VerificationResponse {
  message: string;
  user_id: number;
  email: string;
}

// 注册用户
export const registerUser = async (userData: UserCreate): Promise<User> => {
  const res = await apiClient.post<User>('/api/user/register', userData);
  return res.data;
};

// 用户登录
export const loginUser = async (loginData: LoginRequest): Promise<LoginResponse> => {
  const formData = new FormData();
  formData.append('username', loginData.username);
  formData.append('password', loginData.password);

  const res = await apiClient.post<LoginResponse>('/api/user/token', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

// 获取当前用户信息
export const getCurrentUser = async (token: string): Promise<User> => {
  const res = await apiClient.get<User>('/api/user/users/me/', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.data;
};

// 验证邮箱
export const verifyEmail = async (token: string): Promise<VerificationResponse> => {
  const res = await apiClient.get<VerificationResponse>(`/api/user/verify-email?token=${token}`);
  return res.data;
};

// 重新发送验证邮件
export const resendVerificationEmail = async (email: string): Promise<void> => {
  await apiClient.post<void>('/api/user/resend-verification', { email });
};
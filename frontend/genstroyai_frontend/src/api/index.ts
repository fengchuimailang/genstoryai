// 导出 API 客户端
export { apiClient, ApiClient } from './api-client';
export type { ApiError, ApiResponse } from './api-client';

// 导出认证相关 API
export {
  registerUser,
  loginUser,
  getCurrentUser,
  verifyEmail,
  resendVerificationEmail,
} from './auth-api';

// 导出类型定义
export type {
  User,
  UserCreate,
  LoginRequest,
  LoginResponse,
  VerificationResponse,
} from './auth-api'; 
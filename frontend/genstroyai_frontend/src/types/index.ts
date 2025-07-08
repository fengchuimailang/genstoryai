// 通用类型
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

// 认证相关类型
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastLoginTime: number | null;
}

// 表单相关类型
export interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// 组件 Props 类型
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

// 路由相关类型
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  protected?: boolean;
  public?: boolean;
  exact?: boolean;
}

// 国际化相关类型
export type Language = 'zh' | 'en' | 'ja' | 'ko';

export interface TranslationKeys {
  common: Record<string, string>;
  auth: Record<string, string>;
  validation: Record<string, string>;
  errors: Record<string, string>;
  messages: Record<string, string>;
}

// 错误相关类型
export interface ApiError {
  detail: string;
  code?: string;
  field?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// 常量类型
export interface AppConstants {
  API_BASE_URL: string;
  APP_NAME: string;
  DEFAULT_LANGUAGE: Language;
  SUPPORTED_LANGUAGES: Language[];
  TOKEN_KEY: string;
  USER_KEY: string;
} 
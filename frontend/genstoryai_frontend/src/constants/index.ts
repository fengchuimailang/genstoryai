import type { AppConstants, Language } from '@/types';

export const APP_CONSTANTS: AppConstants = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:80',
  APP_NAME: 'GenStoryAI',
  DEFAULT_LANGUAGE: 'zh',
  SUPPORTED_LANGUAGES: ['zh', 'en', 'ja', 'ko'],
  TOKEN_KEY: 'auth-token',
  USER_KEY: 'auth-user',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/user/token',
    REGISTER: '/user/register',
    VERIFY_EMAIL: '/user/verify-email',
    RESEND_VERIFICATION: '/user/resend-verification',
    CURRENT_USER: '/user/users/me/',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile/update',
  },
} as const;

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  TEST: '/test',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth-token',
  USER_DATA: 'user-data',
  LANGUAGE: 'app-language',
  THEME: 'app-theme',
} as const;

export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
} as const;

export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  FORM_SUBMIT: 1000,
  API_REQUEST: 500,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接错误，请检查网络连接',
  SERVER_ERROR: '服务器错误，请稍后重试',
  UNAUTHORIZED: '未授权访问，请重新登录',
  FORBIDDEN: '权限不足',
  NOT_FOUND: '请求的资源不存在',
  TIMEOUT: '请求超时，请稍后重试',
  UNKNOWN: '未知错误，请稍后重试',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '登录成功',
  REGISTER_SUCCESS: '注册成功',
  LOGOUT_SUCCESS: '退出登录成功',
  EMAIL_VERIFICATION_SENT: '验证邮件已发送',
  EMAIL_VERIFICATION_SUCCESS: '邮箱验证成功',
  PROFILE_UPDATED: '个人信息更新成功',
} as const;

export const LANGUAGES: Record<Language, { name: string; nativeName: string; flag: string }> = {
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
} as const; 
// 错误处理工具函数
export interface ErrorInfo {
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  code?: string;
}

// 错误类型常量
export const ErrorType = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

// 错误代码映射
const ERROR_MESSAGES: Record<string, string> = {
  // 网络错误
  'Network Error': '网络连接错误，请检查网络连接',
  'Failed to fetch': '网络请求失败，请检查网络连接',
  'Request timeout': '请求超时，请稍后重试',
  
  // 服务器错误
  '500': '服务器内部错误，请稍后重试',
  '502': '服务器网关错误，请稍后重试',
  '503': '服务暂时不可用，请稍后重试',
  '504': '网关超时，请稍后重试',
  
  // 客户端错误
  '400': '请求参数错误',
  '401': '未授权访问，请重新登录',
  '403': '权限不足，无法访问',
  '404': '请求的资源不存在',
  '409': '资源冲突，请检查输入',
  '422': '请求数据格式错误',
  
  // API 特定错误
  'Invalid credentials': '用户名或密码错误',
  'Email already registered': '邮箱已被注册',
  'Username already exists': '用户名已存在',
  'Invalid email format': '邮箱格式不正确',
  'Password too weak': '密码强度太弱',
  'Token expired': '验证链接已过期',
  'Invalid token': '无效的验证链接',
  'User not found': '用户不存在',
  'Email not verified': '邮箱未验证',
  'Account disabled': '账户已被禁用',
  'Invalid verification token': '无效的验证链接',
  'Verification token expired': '验证链接已过期',
  'Email verification failed': '邮箱验证失败',
  'Resend verification failed': '重新发送验证邮件失败',
  
  // 表单验证错误
  'required': '此字段为必填项',
  'email': '请输入有效的邮箱地址',
  'password_length': '密码至少需要6个字符',
  'password_mismatch': '密码不匹配',
  'username_length': '用户名至少需要3个字符',
  'username_exists': '用户名已存在',
  'email_exists': '邮箱已被注册',
  'weak_password': '密码强度太弱',
  'invalid_email': '邮箱格式不正确',
};

// 获取用户友好的错误信息
export function getErrorMessage(error: any): string {
  if (!error) {
    return '未知错误，请稍后重试';
  }

  // 如果是字符串，直接查找映射
  if (typeof error === 'string') {
    return ERROR_MESSAGES[error] || error;
  }

  // 如果是 Error 对象
  if (error instanceof Error) {
    const message = error.message;
    
    // 检查是否有映射的错误信息
    if (ERROR_MESSAGES[message]) {
      return ERROR_MESSAGES[message];
    }
    
    // 检查是否是网络错误
    if (message.includes('Network') || message.includes('fetch')) {
      return ERROR_MESSAGES['Network Error'];
    }
    
    // 检查是否是超时错误
    if (message.includes('timeout')) {
      return ERROR_MESSAGES['Request timeout'];
    }
    
    return message || '未知错误，请稍后重试';
  }

  // 如果是对象，尝试获取 detail 或 message 字段
  if (typeof error === 'object') {
    const detail = error.detail || error.message || error.error;
    if (detail) {
      return ERROR_MESSAGES[detail] || detail;
    }
  }

  return '未知错误，请稍后重试';
}

// 获取错误类型
export function getErrorType(error: any): ErrorType {
  if (!error) {
    return ErrorType.UNKNOWN_ERROR;
  }

  const message = typeof error === 'string' ? error : error.message || '';

  // 网络错误
  if (message.includes('Network') || message.includes('fetch') || message.includes('timeout')) {
    return ErrorType.NETWORK_ERROR;
  }

  // 服务器错误
  if (message.includes('500') || message.includes('502') || message.includes('503') || message.includes('504')) {
    return ErrorType.SERVER_ERROR;
  }

  // 认证错误
  if (message.includes('401') || message.includes('403') || message.includes('Invalid credentials')) {
    return ErrorType.AUTH_ERROR;
  }

  // 验证错误
  if (message.includes('400') || message.includes('422') || message.includes('validation')) {
    return ErrorType.VALIDATION_ERROR;
  }

  return ErrorType.UNKNOWN_ERROR;
}

// 创建错误信息对象
export function createErrorInfo(error: any): ErrorInfo {
  const message = getErrorMessage(error);
  const type = getErrorType(error);
  
  return {
    message,
    type: type === ErrorType.AUTH_ERROR ? 'warning' : 'error',
    code: type,
  };
}

// 验证错误处理
export function handleValidationError(field: string, value: any): string | null {
  switch (field) {
    case 'email':
      if (!value) return ERROR_MESSAGES['required'];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return ERROR_MESSAGES['email'];
      break;
      
    case 'password':
      if (!value) return ERROR_MESSAGES['required'];
      if (value.length < 6) return ERROR_MESSAGES['password_length'];
      break;
      
    case 'username':
      if (!value) return ERROR_MESSAGES['required'];
      if (value.length < 3) return ERROR_MESSAGES['username_length'];
      break;
      
    case 'confirmPassword':
      if (!value) return ERROR_MESSAGES['required'];
      break;
  }
  
  return null;
}

// 密码强度检查
export function checkPasswordStrength(password: string): {
  isValid: boolean;
  message: string;
  strength: 'weak' | 'medium' | 'strong';
} {
  if (!password) {
    return {
      isValid: false,
      message: ERROR_MESSAGES['required'],
      strength: 'weak'
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: ERROR_MESSAGES['password_length'],
      strength: 'weak'
    };
  }

  // 检查密码强度
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length >= 8 && hasLetter && hasNumber && hasSpecial) {
    return {
      isValid: true,
      message: '密码强度：强',
      strength: 'strong'
    };
  } else if (password.length >= 6 && hasLetter && hasNumber) {
    return {
      isValid: true,
      message: '密码强度：中等',
      strength: 'medium'
    };
  } else {
    return {
      isValid: false,
      message: ERROR_MESSAGES['weak_password'],
      strength: 'weak'
    };
  }
}

// 表单验证
export function validateForm(data: Record<string, any>, rules: Record<string, string[]>): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    
    for (const _ of fieldRules) {
      const error = handleValidationError(field, value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  }

  return errors;
} 
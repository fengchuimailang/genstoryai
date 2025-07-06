const API_BASE_URL = 'http://localhost:8000';

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

export interface ApiError {
  detail: string;
}

// 注册用户
export const registerUser = async (userData: UserCreate): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || '注册失败');
  }

  return response.json();
};

// 用户登录
export const loginUser = async (loginData: LoginRequest): Promise<LoginResponse> => {
  const formData = new FormData();
  formData.append('username', loginData.username);
  formData.append('password', loginData.password);

  const response = await fetch(`${API_BASE_URL}/user/token`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || '登录失败');
  }

  return response.json();
};

// 获取当前用户信息
export const getCurrentUser = async (token: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/user/users/me/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || '获取用户信息失败');
  }

  return response.json();
};

// 重新发送验证邮件
export const resendVerificationEmail = async (email: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/user/resend-verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || '重新发送验证邮件失败');
  }
};
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { loginUser, getCurrentUser, registerUser } from '@/api/auth-api';
import type { LoginRequest, UserCreate } from '@/api/auth-api';

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setToken,
    setLoading,
    setError,
    clearError,
    logout: logoutStore,
  } = useAuthStore();

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        setLoading(true);
        clearError();

        // 登录
        const loginResponse = await loginUser(credentials);
        setToken(loginResponse.access_token);

        // 获取用户信息
        const user = await getCurrentUser(loginResponse.access_token);
        setUser(user);

        // 登录成功，跳转到首页
        navigate('/home');
        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '登录失败';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [navigate, setUser, setToken, setLoading, setError, clearError]
  );

  const register = useCallback(
    async (userData: UserCreate) => {
      try {
        setLoading(true);
        clearError();

        const user = await registerUser(userData);
        setUser(user);

        // 注册成功，跳转到验证邮箱页面
        navigate('/verify-email');
        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '注册失败';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [navigate, setUser, setLoading, setError, clearError]
  );

  const logout = useCallback(() => {
    logoutStore();
    navigate('/login');
  }, [logoutStore, navigate]);

  const checkAuth = useCallback(() => {
    return isAuthenticated && !!token;
  }, [isAuthenticated, token]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };
}; 
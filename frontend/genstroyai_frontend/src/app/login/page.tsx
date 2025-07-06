import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { loginUser, getCurrentUser } from '../../api/auth';
import { useAuthStore } from '../../lib/store';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setToken, setError, clearError, isLoading, setLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    username: '', // 可以是邮箱或用户名
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      setLoading(true);
      
      // 登录
      const loginResponse = await loginUser({
        username: formData.username,
        password: formData.password,
      });

      // 保存 token
      setToken(loginResponse.access_token);

      // 获取用户信息
      const user = await getCurrentUser(loginResponse.access_token);
      setUser(user);

      // 登录成功，跳转到首页
      navigate('/home');
    } catch (error) {
      setError(error instanceof Error ? error.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">登录账户</CardTitle>
          <CardDescription className="text-center">
            登录您的 GenStoryAI 账户
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名或邮箱</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="请输入用户名或邮箱"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="请输入密码"
              />
            </div>

            {useAuthStore.getState().error && (
              <div className="text-red-500 text-sm">
                {useAuthStore.getState().error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>

            <div className="text-center text-sm">
              还没有账户？{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:text-blue-500"
              >
                立即注册
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

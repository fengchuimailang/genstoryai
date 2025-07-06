import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { registerUser } from '../../api/auth';
import { useAuthStore } from '../../lib/store';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setError, clearError, isLoading, setLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // 验证密码
    if (formData.password !== formData.confirmPassword) {
      setError('密码不匹配');
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    // 验证密码长度
    if (formData.password.length < 6) {
      setError('密码至少需要6个字符');
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      // 注册成功，显示成功消息并跳转到登录页面
      alert('注册成功！请检查您的邮箱并点击验证链接激活账户。');
      navigate('/login');
    } catch (error) {
      setError(error instanceof Error ? error.message : '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">注册账户</CardTitle>
          <CardDescription className="text-center">
            创建您的 GenStoryAI 账户
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="请输入用户名"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="请输入邮箱地址"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="请再次输入密码"
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
              {isLoading ? '注册中...' : '注册'}
            </Button>

            <div className="text-center text-sm">
              已有账户？{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-500"
              >
                立即登录
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

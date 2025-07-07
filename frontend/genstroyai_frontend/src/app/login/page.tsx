import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert } from '../../components/ui/alert';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { loginUser, getCurrentUser } from '../../api/auth-api';
import { useAuthStore } from '../../lib/store';
import { getErrorMessage } from '../../lib/error-handler';
import { i18n } from '../../lib/i18n';

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
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {i18n.t('auth.login')}
          </CardTitle>
          <CardDescription className="text-center">
            {i18n.t('messages.loginToContinue')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{i18n.t('auth.username')}</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder={i18n.t('auth.username')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{i18n.t('auth.password')}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder={i18n.t('auth.password')}
              />
            </div>

            {useAuthStore.getState().error && (
              <Alert 
                type="error" 
                message={useAuthStore.getState().error || ''} 
              />
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? i18n.t('common.loading') : i18n.t('auth.login')}
            </Button>

            <div className="text-center text-sm">
              {i18n.t('messages.registerToStart')}{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:text-blue-500"
              >
                {i18n.t('auth.register')}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

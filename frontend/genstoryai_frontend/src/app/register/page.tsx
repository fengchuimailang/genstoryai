import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert } from '../../components/ui/alert';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { registerUser } from '../../api';
import { useAuthStore } from '../../lib/store';
import { getErrorMessage, handleValidationError } from '../../lib/error-handler';
import { i18n } from '../../lib/i18n';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setError, clearError, isLoading, setLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    clearError();
    
    // 清除对应字段的验证错误
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // 验证用户名
    const usernameError = handleValidationError('username', formData.username);
    if (usernameError) errors.username = usernameError;

    // 验证邮箱
    const emailError = handleValidationError('email', formData.email);
    if (emailError) errors.email = emailError;

    // 验证密码
    const passwordError = handleValidationError('password', formData.password);
    if (passwordError) errors.password = passwordError;

    // 验证确认密码
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = i18n.t('validation.passwordMismatch');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // 验证表单
    if (!validateForm()) {
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
      alert(i18n.t('messages.accountCreated'));
      navigate('/login');
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
            {i18n.t('auth.register')}
          </CardTitle>
          <CardDescription className="text-center">
            {i18n.t('messages.registerToStart')}
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
                className={validationErrors.username ? 'border-red-500' : ''}
              />
              {validationErrors.username && (
                <p className="text-red-500 text-sm">{validationErrors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{i18n.t('auth.email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={i18n.t('auth.email')}
                className={validationErrors.email ? 'border-red-500' : ''}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm">{validationErrors.email}</p>
              )}
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
                className={validationErrors.password ? 'border-red-500' : ''}
              />
              {validationErrors.password && (
                <p className="text-red-500 text-sm">{validationErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{i18n.t('auth.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={i18n.t('auth.confirmPassword')}
                className={validationErrors.confirmPassword ? 'border-red-500' : ''}
              />
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-sm">{validationErrors.confirmPassword}</p>
              )}
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
              {isLoading ? i18n.t('common.loading') : i18n.t('auth.register')}
            </Button>

            <div className="text-center text-sm">
              {i18n.t('messages.loginToContinue')}{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-500"
              >
                {i18n.t('auth.login')}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

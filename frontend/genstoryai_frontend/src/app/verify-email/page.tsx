import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert } from '../../components/ui/alert';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { debounce, RequestLock } from '../../lib/utils';
import { verifyEmail, resendVerificationEmail } from '../../api/auth-api';
import type { VerificationResponse } from '../../api/auth-api';
import { getErrorMessage } from '../../lib/error-handler';
import { i18n } from '../../lib/i18n';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'resend'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 请求锁实例
  const requestLockRef = useRef(new RequestLock(10000)); // 10秒超时
  const isVerifyingRef = useRef(false);

  // 防抖的验证函数
  const debouncedVerifyEmail = useCallback(
    debounce(async (token: string) => {
      if (isVerifyingRef.current) {
        console.log('验证请求正在进行中，跳过重复请求');
        return;
      }

      const lockAcquired = await requestLockRef.current.acquire();
      if (!lockAcquired) {
        console.log('请求被锁定，跳过重复请求');
        return;
      }

      isVerifyingRef.current = true;
      setError(null);
      
      try {
        const data: VerificationResponse = await verifyEmail(token);
        setStatus('success');
        setMessage(data.message);
        setEmail(data.email);
      } catch (error) {
        setStatus('error');
        const errorMessage = getErrorMessage(error);
        setMessage(errorMessage);
        setError(errorMessage);
      } finally {
        isVerifyingRef.current = false;
        requestLockRef.current.release();
      }
    }, 300), // 300ms 防抖延迟
    []
  );

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      debouncedVerifyEmail(token);
    } else {
      setStatus('error');
      setMessage(i18n.t('auth.invalidToken'));
      setError(i18n.t('auth.invalidToken'));
    }
  }, [searchParams, debouncedVerifyEmail]);

  // 防抖的重发验证函数
  const debouncedResendVerification = useCallback(
    debounce(async (email: string) => {
      if (isResending) {
        console.log('重发请求正在进行中，跳过重复请求');
        return;
      }

      const lockAcquired = await requestLockRef.current.acquire();
      if (!lockAcquired) {
        console.log('请求被锁定，跳过重复请求');
        return;
      }

      setIsResending(true);
      setError(null);
      
      try {
        await resendVerificationEmail(email);
        setStatus('success');
        setMessage(i18n.t('messages.verificationEmailSent'));
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setMessage(errorMessage);
        setError(errorMessage);
      } finally {
        setIsResending(false);
        requestLockRef.current.release();
      }
    }, 500), // 500ms 防抖延迟
    [isResending]
  );

  const resendVerification = async (email: string) => {
    debouncedResendVerification(email);
  };

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && !isResending && !requestLockRef.current.isRequestLocked()) {
      resendVerification(email);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{i18n.t('common.loading')}</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-green-600 mb-2">{i18n.t('auth.verificationSuccess')}</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button onClick={() => navigate('/login')} className="w-full">
              {i18n.t('auth.login')}
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">✗</div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">{i18n.t('auth.verificationFailed')}</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button 
              variant="outline" 
              onClick={() => setStatus('resend')}
              className="w-full mb-2"
            >
              {i18n.t('auth.resendVerification')}
            </Button>
            <Button onClick={() => navigate('/login')} className="w-full">
              {i18n.t('auth.login')}
            </Button>
          </div>
        );

      case 'resend':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">{i18n.t('auth.resendVerification')}</h2>
            <form onSubmit={handleResend} className="space-y-4">
              <div>
                <Label htmlFor="email">{i18n.t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={i18n.t('auth.email')}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isResending}
              >
                {isResending ? i18n.t('common.loading') : i18n.t('auth.resendVerification')}
              </Button>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                {i18n.t('auth.login')}
              </Button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{i18n.t('auth.emailVerification')}</CardTitle>
          <CardDescription className="text-center">
            {status === 'loading' && i18n.t('common.loading')}
            {status === 'success' && i18n.t('auth.verificationSuccess')}
            {status === 'error' && i18n.t('auth.verificationFailed')}
            {status === 'resend' && i18n.t('auth.resendVerification')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert 
              type="error" 
              message={error} 
              className="mb-4"
            />
          )}
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
} 
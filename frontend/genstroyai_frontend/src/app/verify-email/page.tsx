import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const API_BASE_URL = 'http://localhost:8000';

interface VerificationResponse {
  message: string;
  user_id: number;
  email: string;
}

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'resend'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('无效的验证链接');
    }
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/verify-email?token=${token}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data: VerificationResponse = await response.json();
        setStatus('success');
        setMessage(data.message);
        setEmail(data.email);
      } else {
        const errorData = await response.json();
        setStatus('error');
        setMessage(errorData.detail || '验证失败');
      }
    } catch (error) {
      setStatus('error');
      setMessage('网络错误，请稍后重试');
    }
  };

  const resendVerification = async (email: string) => {
    setIsResending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('验证邮件已重新发送，请检查您的邮箱');
      } else {
        const errorData = await response.json();
        setMessage(errorData.detail || '重新发送失败');
      }
    } catch (error) {
      setMessage('网络错误，请稍后重试');
    } finally {
      setIsResending(false);
    }
  };

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      resendVerification(email);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在验证您的邮箱...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-green-600 mb-2">验证成功！</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button onClick={() => navigate('/login')} className="w-full">
              前往登录
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">✗</div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">验证失败</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button 
              variant="outline" 
              onClick={() => setStatus('resend')}
              className="w-full mb-2"
            >
              重新发送验证邮件
            </Button>
            <Button onClick={() => navigate('/login')} className="w-full">
              返回登录
            </Button>
          </div>
        );

      case 'resend':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">重新发送验证邮件</h2>
            <form onSubmit={handleResend} className="space-y-4">
              <div>
                <Label htmlFor="email">邮箱地址</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入您的邮箱地址"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isResending}
              >
                {isResending ? '发送中...' : '发送验证邮件'}
              </Button>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                返回登录
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">邮箱验证</CardTitle>
          <CardDescription className="text-center">
            {status === 'loading' && '正在验证您的邮箱地址...'}
            {status === 'success' && '您的邮箱已成功验证'}
            {status === 'error' && '验证过程中遇到问题'}
            {status === 'resend' && '重新发送验证邮件'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
} 
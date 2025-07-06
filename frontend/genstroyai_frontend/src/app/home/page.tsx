import { useAuthStore } from '../../lib/store';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function HomePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">GenStoryAI</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                欢迎，{user?.username || '用户'}！
              </span>
              <Button onClick={handleLogout} variant="outline">
                退出登录
              </Button>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Homepage</h2>
            <p className="text-gray-600">
              这是 GenStoryAI 的首页。您可以在这里开始创建您的故事。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
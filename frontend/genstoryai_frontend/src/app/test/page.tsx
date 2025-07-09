import { useAuthStore } from '../../lib/store';

export default function TestPage() {
  const { user, isAuthenticated, token } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">认证状态测试</h1>
        
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">认证状态</h2>
            <p className="text-gray-600">
              已认证: {isAuthenticated ? '是' : '否'}
            </p>
          </div>
          
          {user && (
            <div>
              <h2 className="text-xl font-semibold mb-2">用户信息</h2>
              <div className="bg-gray-50 p-4 rounded">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>用户名:</strong> {user.username}</p>
                <p><strong>邮箱:</strong> {user.email}</p>
                <p><strong>是否激活:</strong> {user.is_active ? '是' : '否'}</p>
                <p><strong>是否验证:</strong> {user.is_verified ? '是' : '否'}</p>
              </div>
            </div>
          )}
          
          {token && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Token</h2>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm break-all">{token}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
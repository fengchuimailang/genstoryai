import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// 注意：若仍报错找不到模块，需确保已安装 react-router-dom，可运行命令：npm install react-router-dom @types/react-router-dom
import { useAuthStore } from './lib/store';
import LoginPage from './app/login/page';
import RegisterPage from './app/register/page';
import HomePage from './app/home/home';
import TestPage from './app/test/page';
import VerifyEmailPage from './app/verify-email/page';
import GenerationPage from './app/Generation/page';

// 受保护的路由组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // const { isAuthenticated } = useAuthStore();
  
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }
  
  return <>{children}</>;
};

// 公共路由组件（已登录用户重定向到首页）
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* 默认重定向到登录页 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 公共路由 */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/verify-email" 
          element={<VerifyEmailPage />} 
        />
        
        {/* 受保护的路由 */}
        <Route 
          path="/home/*" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/generation" 
          element={
            <ProtectedRoute>
              <GenerationPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/test" 
          element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 重定向 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
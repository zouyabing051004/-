import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import MainLayout from '@/components/layouts/MainLayout';
import FloatingAvatarChat from '@/components/FloatingAvatarChat';
import CelebrationOverlay from '@/components/CelebrationOverlay';
import { AchievementProvider } from '@/contexts/AchievementContext';
import { AuthProvider } from '@/contexts/AuthContext';
import LoginPage from '@/pages/LoginPage';

import { routes } from './routes';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AchievementProvider>
        <Router>
          <IntersectObserver />
          <Routes>
            {/* 登录页独立渲染，不套 MainLayout */}
            <Route path="/login" element={<LoginPage />} />
            {/* 其他页面套 MainLayout */}
            <Route
              path="*"
              element={
                <MainLayout>
                  <Routes>
                    {routes.map((route, index) => (
                      <Route
                        key={index}
                        path={route.path}
                        element={route.element}
                      />
                    ))}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </MainLayout>
              }
            />
          </Routes>
          {/* 数字人悬浮对话框 - 全局右下角 */}
          <FloatingAvatarChat />
          {/* 成就解锁庆祝覆盖层 */}
          <CelebrationOverlay />
          <Toaster />
        </Router>
      </AchievementProvider>
    </AuthProvider>
  );
};

export default App;

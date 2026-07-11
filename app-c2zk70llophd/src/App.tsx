import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import MainLayout from '@/components/layouts/MainLayout';
import FloatingAvatarChat from '@/components/FloatingAvatarChat';
import CelebrationOverlay from '@/components/CelebrationOverlay';
import { AchievementProvider } from '@/contexts/AchievementContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import LoginPage from '@/pages/LoginPage';

import { routes } from './routes';

// 路由模式：默认 BrowserRouter；静态对象存储托管（无 SPA 回写规则）时用 hash 模式
const ROUTER_MODE = import.meta.env.VITE_ROUTER_MODE as string | undefined;
const Router = ROUTER_MODE === 'hash' ? HashRouter : BrowserRouter;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
      <AchievementProvider>
        <Router basename={ROUTER_MODE === 'hash' ? undefined : import.meta.env.BASE_URL}>
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
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;

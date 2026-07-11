import HomePage from './pages/HomePage';
import SolarTermDetailPage from './pages/SolarTermDetailPage';
import QAPage from './pages/QAPage';
import CreationPage from './pages/CreationPage';
import PoetryPage from './pages/PoetryPage';
import CommunityPage from './pages/CommunityPage';
import AchievementPage from './pages/AchievementPage';
import FolkFoodPage from './pages/FolkFoodPage';
import CustomsPage from './pages/CustomsPage';
import CultureAgentPage from './pages/CultureAgentPage';
import type { ReactNode } from 'react';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  public?: boolean;
}

export const routes: RouteConfig[] = [
  {
    name: '首页',
    path: '/',
    element: <HomePage />,
    public: true,
  },
  {
    name: '节气详情',
    path: '/solar-term/:id',
    element: <SolarTermDetailPage />,
    public: true,
  },
  {
    name: '民俗饮食',
    path: '/folk-food',
    element: <FolkFoodPage />,
    public: true,
  },
  {
    name: '传统习俗',
    path: '/customs',
    element: <CustomsPage />,
    public: true,
  },
  {
    name: '实景社区',
    path: '/community',
    element: <CommunityPage />,
    public: true,
  },
  {
    name: '积分排行',
    path: '/achievement',
    element: <AchievementPage />,
    public: true,
  },
  {
    name: '节气问答',
    path: '/qa',
    element: <QAPage />,
    public: true,
  },
  {
    name: '引导创作',
    path: '/creation',
    element: <CreationPage />,
    public: true,
  },
  {
    name: '诗词配画',
    path: '/poetry',
    element: <PoetryPage />,
    public: true,
  },
  {
    name: 'AI文化伙伴',
    path: '/culture',
    element: <CultureAgentPage />,
    public: true,
  },
];


import { TopPageData } from '../types';

// Mock data generator for top pages data
export const generateMockTopPagesData = (): TopPageData[] => {
  return [
    { path: '/', pageTitle: 'Home', views: 1245, exitRate: 42, avgTimeOnPage: 68 },
    { path: '/experience', pageTitle: 'Experience', views: 890, exitRate: 35, avgTimeOnPage: 127 },
    { path: '/process', pageTitle: 'Process', views: 654, exitRate: 28, avgTimeOnPage: 93 },
    { path: '/pricing', pageTitle: 'Pricing', views: 521, exitRate: 22, avgTimeOnPage: 145 },
    { path: '/blog', pageTitle: 'Blog', views: 435, exitRate: 47, avgTimeOnPage: 85 },
    { path: '/contact', pageTitle: 'Contact', views: 312, exitRate: 76, avgTimeOnPage: 42 },
    { path: '/faq', pageTitle: 'FAQ', views: 287, exitRate: 34, avgTimeOnPage: 118 }
  ];
};

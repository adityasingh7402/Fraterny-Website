import React, { useState } from 'react';
import { Users, FileText, CreditCard, BarChart3, Menu, X } from 'lucide-react';
import AdminUserManagement from './users/AdminUserManagement';
import AdminSummaryManagement from './summaries/AdminSummaryManagement';
import AdminQuestPayment from './payments/AdminQuestPayment';

// Define menu items
const menuItems = [
  {
    id: 'overview',
    label: 'Dashboard Overview',
    icon: BarChart3,
    component: null // We'll create a simple overview component
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    component: AdminUserManagement
  },
  {
    id: 'summaries',
    label: 'Summary Management',
    icon: FileText,
    component: AdminSummaryManagement
  },
  {
    id: 'payments',
    label: 'Payment Dashboard',
    icon: CreditCard,
    component: AdminQuestPayment
  }
];

// Simple Overview Component
const DashboardOverview: React.FC = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the admin dashboard. Select a section from the sidebar to get started.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats Cards */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Users</h3>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">1,234</p>
          <p className="text-sm text-gray-600">Total registered users</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Summaries</h3>
            <FileText className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">5,678</p>
          <p className="text-sm text-gray-600">Generated summaries</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Payments</h3>
            <CreditCard className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">$12,345</p>
          <p className="text-sm text-gray-600">Total revenue</p>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Manage Users</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <FileText className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">View Summaries</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <CreditCard className="h-5 w-5 text-purple-600" />
            <span className="text-purple-800 font-medium">Payment Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get the active component
  const getActiveComponent = () => {
    const activeItem = menuItems.find(item => item.id === activeMenuItem);
    
    if (!activeItem) return <DashboardOverview />;
    
    if (activeItem.id === 'overview') {
      return <DashboardOverview />;
    }
    
    if (activeItem.component) {
      const Component = activeItem.component;
      return <Component />;
    }
    
    return <DashboardOverview />;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-24'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {sidebarOpen && (
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenuItem === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveMenuItem(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    title={sidebarOpen ? '' : item.label}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    {sidebarOpen && (
                      <span className={`font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                        {item.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">A</span>
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@fraterny.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {menuItems.find(item => item.id === activeMenuItem)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {getActiveComponent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
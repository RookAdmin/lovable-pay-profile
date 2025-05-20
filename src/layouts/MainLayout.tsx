
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  ChartPie,
  Puzzle,
  BadgeCheck,
  Settings,
  CreditCard
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  
  // Only show sidebar in dashboard-related pages
  const isDashboardPath = 
    location.pathname.includes('/dashboard') || 
    location.pathname.includes('/analytics') ||
    location.pathname.includes('/settings');

  if (!isDashboardPath) {
    return (
      <div className="flex flex-col min-h-screen w-full">
        <Navbar />
        <main className="flex-1 w-full">
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  }

  // Navigation items configuration for sidebar
  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: ChartPie, label: "Analytics", path: "/analytics" },
    { icon: Puzzle, label: "Apps & Integrations", path: "/dashboard", tabId: "apps-integrations" },
    { icon: BadgeCheck, label: "Verification", path: "/dashboard", tabId: "verification" },
    { icon: CreditCard, label: "Subscription", path: "/dashboard", tabId: "subscription" },
    { icon: Settings, label: "Settings", path: "/dashboard", tabId: "settings" },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div 
          className={`${
            sidebarCollapsed ? 'w-[60px]' : 'w-[250px]'
          } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex-shrink-0 relative h-[calc(100vh-64px)] overflow-y-auto`}
        >
          <div className="sticky top-0 flex flex-col h-full">
            <div className="flex-1 py-4 px-2">
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Link 
                    key={item.label} 
                    to={`${item.path}${item.tabId ? `?tab=${item.tabId}` : ''}`} 
                    className={`flex items-center p-2 rounded-md transition-colors ${
                      location.pathname === item.path || 
                      (location.pathname.includes(item.path) && item.tabId && location.search.includes(item.tabId))
                        ? 'bg-gray-100 dark:bg-gray-700 text-rook-red'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <item.icon size={20} className={sidebarCollapsed ? 'mx-auto' : 'mr-3'} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                ))}
              </div>
            </div>

            {/* Collapse/Expand button */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-full p-2 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              >
                {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                {!sidebarCollapsed && <span className="ml-2">Collapse</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 overflow-x-hidden">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

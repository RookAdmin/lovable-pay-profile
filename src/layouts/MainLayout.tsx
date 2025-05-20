
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  ChartPie,
  CreditCard,
  Puzzle,
  BadgeCheck,
  Settings,
  Link as LinkIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  
  // Only show sidebar in dashboard-related pages
  const isDashboardPath = 
    location.pathname.includes('/dashboard') || 
    location.pathname.includes('/analytics') ||
    location.pathname.includes('/settings') ||
    location.pathname.includes('/profile');

  if (!isDashboardPath || !user) {
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
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      path: "/dashboard" 
    },
    { 
      icon: LinkIcon, 
      label: "Payms", 
      path: "/dashboard", 
      tabId: "smart-links" 
    },
    { 
      icon: ChartPie, 
      label: "Analytics", 
      path: "/analytics" 
    },
    { 
      icon: Puzzle, 
      label: "Apps & Integrations", 
      path: "/dashboard", 
      tabId: "apps-integrations" 
    },
    { 
      icon: BadgeCheck, 
      label: "Verification", 
      path: "/dashboard", 
      tabId: "verification" 
    },
    { 
      icon: CreditCard, 
      label: "Subscription", 
      path: "/dashboard", 
      tabId: "subscription" 
    },
    { 
      icon: Settings, 
      label: "Settings", 
      path: "/dashboard", 
      tabId: "settings" 
    },
  ];

  const isActive = (item) => {
    if (location.pathname === item.path) {
      return !item.tabId || (item.tabId && location.search.includes(item.tabId));
    }
    return location.pathname.includes(item.path) && (!item.tabId || location.search.includes(item.tabId));
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div 
          className={cn(
            "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex-shrink-0 relative h-[calc(100vh-64px)] overflow-y-auto",
            sidebarCollapsed ? 'w-[60px]' : 'w-[220px]'
          )}
        >
          <div className="sticky top-0 flex flex-col h-full">
            <div className="flex-1 py-4 px-2">
              <div className="space-y-1">
                <TooltipProvider delayDuration={0}>
                  {navigationItems.map((item) => (
                    <Tooltip key={item.label}>
                      <TooltipTrigger asChild>
                        <Link 
                          to={`${item.path}${item.tabId ? `?tab=${item.tabId}` : ''}`} 
                          className={cn(
                            "flex items-center p-2 rounded-md transition-colors",
                            isActive(item)
                              ? "bg-gray-100 dark:bg-gray-700 text-rook-red"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          )}
                        >
                          <item.icon size={20} className={sidebarCollapsed ? 'mx-auto' : 'mr-3'} />
                          {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className={cn(sidebarCollapsed ? "block" : "hidden")}>
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </div>

            {/* Collapse/Expand button */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-full p-2 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? <ChevronRight size={20} /> : <>
                  <ChevronLeft size={20} />
                  {!sidebarCollapsed && <span className="ml-2 text-sm">Collapse</span>}
                </>}
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

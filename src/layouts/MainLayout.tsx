
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isDashboardOrAnalytics = location.pathname.includes('/dashboard') || 
                                location.pathname.includes('/analytics');
  
  return (
    <div className="flex flex-col min-h-screen w-full">
      {!isDashboardOrAnalytics && <Navbar />}
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      {!isDashboardOrAnalytics && <Footer />}
    </div>
  );
};

export default MainLayout;

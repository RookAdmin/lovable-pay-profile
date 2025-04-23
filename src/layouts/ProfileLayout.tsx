
import React from 'react';
import { Outlet } from 'react-router-dom';
import Logo from '@/components/Logo';

const ProfileLayout: React.FC = () => {
  // Force console logs to help with debugging
  console.log("Rendering ProfileLayout - This is a public page that should work without login");
  
  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="w-full border-b border-gray-100 py-4">
        <div className="container px-4">
          <Logo />
        </div>
      </header>
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <footer className="w-full border-t border-gray-100 py-4">
        <div className="container px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by <span className="gradient-text font-semibold">paym.me</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProfileLayout;

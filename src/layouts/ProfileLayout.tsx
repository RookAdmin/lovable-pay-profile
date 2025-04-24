
import React from 'react';
import { Outlet } from 'react-router-dom';
import Logo from '@/components/Logo';

const ProfileLayout: React.FC = () => {
  console.log("Rendering ProfileLayout - This is a public page that should work without login");
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-background via-muted to-background">
      <header className="w-full border-b border-white/10 backdrop-blur-md bg-background/50 sticky top-0 z-50">
        <div className="container px-4 py-4">
          <Logo />
        </div>
      </header>
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <footer className="w-full border-t border-white/10 backdrop-blur-md bg-background/50">
        <div className="container px-4 py-6">
          <p className="text-sm text-center text-muted-foreground">
            Powered by <span className="gradient-text font-semibold">paym.me</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProfileLayout;
